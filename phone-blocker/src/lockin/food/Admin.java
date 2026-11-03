package lockin.food;

import android.app.admin.DeviceAdminReceiver;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.UserManager;
import android.util.Log;
import java.util.Arrays;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Pattern;

/** Device owner. Holds every policy; Guard and Lock just call in here. */
public class Admin extends DeviceAdminReceiver {
    static final String TAG = "lockin";
    static final long UNTIL = new GregorianCalendar(2027, Calendar.MAY, 1).getTimeInMillis();

    static final int NONE = 0, FULL = 1, PARTIAL = 2;

    // Matched against the app's visible name (lowercase), so exact package names don't matter.
    static final String[] FULL_NAMES = {
        "zomato", "swiggy", "eatsure", "eatclub", "toing", "faasos", "behrouz", "ovenstory", "box8",
        "domino's", "domino’s", "pizza hut", "mcdonald", "mcdelivery", "kfc", "burger king", "starbucks",
        "taco bell", "magicpin", "bistro", "snacc", "zepto cafe", "zepto café",
        "wendy", "dunkin", "baskin", "haldiram", "chaayos", "theobroma", "krispy kreme", "bikanervala",
        "barbeque nation", "papa john", "lunchbox", "sweet truth", "eatfit",
    };
    // Every brand not named above (Mojo Pizza, La Pino'z, ...): checked against app names and Chrome's address bar.
    // Substrings on purpose, since site names run words together: "pizz" catches mojopizza.in.
    static final Pattern FOOD = Pattern.compile("pizz|burger|biryani|food|momo|kitchen|baker|cakes|pastr|donut"
            + "|doughnut|dessert|ice ?cream|waffle|sweets|mithai|kebab|kabab|shawarma|tiffin|dhaba|restaurant"
            + "|eatery|dineout|meals|chaat|rasoi|bhojan", Pattern.CASE_INSENSITIVE);
    // Groceries allowed, junk in the cart is not (see Guard).
    static final String[] PARTIAL_NAMES = {
        "instamart", "blinkit", "zepto", "bigbasket", "jiomart", "dmart", "amazon", "flipkart",
    };

    static final String CHROME = "com.android.chrome";
    static final String[] SITES = {
        "zomato.com", "swiggy.com", "eatsure.com", "eatclub.in", "faasos.com", "behrouzbiryani.com",
        "ovenstory.in", "box8.in", "dominos.co.in", "pizzahut.co.in", "mcdelivery.co.in",
        "mcdonaldsindia.com", "kfc.co.in", "burgerking.in", "starbucks.in", "magicpin.in",
        "blinkit.com", "zeptonow.com", "zepto.com", "bigbasket.com",
        "haldirams.com", "theobroma.in", "chaayos.com", "barbequenation.com",
    };

    // Applied by Lock. Recovery-mode wipe is the one thing no app can stop.
    static final String[] LOCKS = {
        UserManager.DISALLOW_DEBUGGING_FEATURES, UserManager.DISALLOW_CONFIG_DATE_TIME,
        UserManager.DISALLOW_FACTORY_RESET, UserManager.DISALLOW_ADD_USER, UserManager.DISALLOW_SAFE_BOOT,
        UserManager.DISALLOW_INSTALL_UNKNOWN_SOURCES_GLOBALLY,
    };

    static DevicePolicyManager dpm(Context c) { return c.getSystemService(DevicePolicyManager.class); }
    static ComponentName admin(Context c) { return new ComponentName(c, Admin.class); }
    static boolean owner(Context c) { return dpm(c).isDeviceOwnerApp(c.getPackageName()); }
    static boolean expired() { return System.currentTimeMillis() >= UNTIL; }

    static int kind(Context c, String pkg) {
        if (pkg.equals(c.getPackageName()) || pkg.equals(CHROME)) return NONE;
        PackageManager pm = c.getPackageManager();
        String label;
        try {
            label = pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString().toLowerCase(Locale.ROOT);
        } catch (PackageManager.NameNotFoundException e) {
            return NONE;
        }
        if (label.contains("instamart")) return PARTIAL; // "Swiggy Instamart" is groceries, not Swiggy food
        for (String s : FULL_NAMES) if (label.contains(s)) return FULL;
        for (String s : PARTIAL_NAMES) if (label.contains(s)) return PARTIAL;
        if (FOOD.matcher(label).find()) return FULL;
        // Any browser except Chrome: Chrome gets the site blocklist, others would dodge it.
        Intent web = new Intent(Intent.ACTION_VIEW, Uri.parse("http://example.com"))
                .addCategory(Intent.CATEGORY_BROWSABLE).setPackage(pkg);
        return pm.queryIntentActivities(web, 0).isEmpty() ? NONE : FULL;
    }

    /** Suspended = greyed out, won't open. Uninstall-blocked so a reinstall can't clear it. */
    static void block(Context c, String pkg, boolean on) {
        dpm(c).setPackagesSuspended(admin(c), new String[] {pkg}, on);
        dpm(c).setUninstallBlocked(admin(c), pkg, on);
        if (on) Log.i(TAG, "blocked " + pkg);
    }

    /** guardOn=false is fail-closed: Guard was switched off, so grocery apps and installs go dark too. */
    static void sweep(Context c, boolean guardOn) {
        for (ApplicationInfo ai : c.getPackageManager().getInstalledApplications(0)) {
            int k = kind(c, ai.packageName);
            if (k == FULL) block(c, ai.packageName, true);
            else if (k == PARTIAL) block(c, ai.packageName, !guardOn);
        }
        if (guardOn) dpm(c).clearUserRestriction(admin(c), UserManager.DISALLOW_INSTALL_APPS);
        else dpm(c).addUserRestriction(admin(c), UserManager.DISALLOW_INSTALL_APPS);

        blockSites(c);
        Log.i(TAG, "sweep done, guardOn=" + guardOn);
    }

    /** Chrome's blocklist: SITES plus every food site Guard caught since. The policy itself remembers them. */
    static void blockSites(Context c, String... caught) {
        Set<String> all = new TreeSet<>(Arrays.asList(SITES));
        String[] had = dpm(c).getApplicationRestrictions(admin(c), CHROME).getStringArray("URLBlocklist");
        if (had != null) all.addAll(Arrays.asList(had));
        all.addAll(Arrays.asList(caught));
        Bundle chrome = new Bundle();
        chrome.putStringArray("URLBlocklist", all.toArray(new String[0]));
        dpm(c).setApplicationRestrictions(admin(c), CHROME, chrome);
    }

    /** May 2027: undo everything and stop being device owner, so the app can be uninstalled. */
    static void release(Context c) {
        for (ApplicationInfo ai : c.getPackageManager().getInstalledApplications(0)) {
            if (!ai.packageName.equals(c.getPackageName())) block(c, ai.packageName, false);
        }
        for (String r : LOCKS) dpm(c).clearUserRestriction(admin(c), r);
        dpm(c).clearUserRestriction(admin(c), UserManager.DISALLOW_INSTALL_APPS);
        dpm(c).setApplicationRestrictions(admin(c), CHROME, new Bundle());
        dpm(c).clearDeviceOwnerApp(c.getPackageName());
        Log.i(TAG, "released");
    }
}
