package lockin.food;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.util.Log;
import android.view.Gravity;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.TextView;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Watches the foreground app. Food apps: suspend + go home. Grocery apps: if a junk item is in the
 * cart, a red wall covers the pay button until you remove it and reopen the cart.
 */
public class Guard extends AccessibilityService {
    static volatile boolean running;

    static final Pattern JUNK = Pattern.compile("\\b(chips?|crisps|namkeen|bhujia|kurkure|lay'?s|doritos|pringles|bingo"
            + "|nachos|cheetos|popcorn|chocolates?|dairy milk|kit ?kat|snickers|5 star|munch|perk|ferrero|nutella"
            + "|ice ?creams?|cornetto|magnum|kulfi|sundae|cold ?drinks?|soft drinks?|coca[- ]?cola|coke|pepsi|sprite"
            + "|thums up|fanta|mountain dew|limca|7 ?up|mirinda|red bull|monster|sting|energy drinks?|biscuits?"
            + "|cookies?|oreo|bourbon|hide ?& ?seek|dark fantasy|cakes?|cupcakes?|pastr(y|ies)|brownies?"
            + "|doughnuts?|donuts?|muffins?|cand(y|ies)|gumm(y|ies)|toffees?|lollipops?|mithai|gulab jamun"
            + "|rasgull?a|soan papdi|jalebi|maggi|yippee|instant noodles|cup noodles|pizzas?|burgers?|fries"
            + "|nuggets|samosas?|puffs?|sandwich(es)?|momos?|frozen snacks?|wafers?|swiss roll|cream rolls?"
            + "|milkshakes?|cold coffee|frappe)\\b", Pattern.CASE_INSENSITIVE);
    static final Pattern PAY = Pattern.compile("proceed to (pay|buy|checkout)|place (your )?order"
            + "|(click|slide|swipe|tap) to pay|pay ₹|pay now|make payment|continue to pay|^checkout$",
            Pattern.CASE_INSENSITIVE);
    static final Pattern ADD = Pattern.compile("^(add|add to cart|add to basket)$", Pattern.CASE_INSENSITIVE);
    static final Pattern QTY = Pattern.compile("^\\d{1,2}$"); // the number in a - 1 + stepper

    private final Map<String, Integer> kinds = new HashMap<>();
    private boolean cartJunk; // sticky until you leave the cart, so scrolling the junk off-screen doesn't help
    private TextView wall;
    private final Rect wallAt = new Rect();

    @Override
    protected void onServiceConnected() {
        running = true;
        if (!Admin.owner(this)) { Log.w(Admin.TAG, "not device owner, doing nothing"); return; }
        if (Admin.expired()) { Admin.release(this); disableSelf(); return; }
        Admin.sweep(this, true);
    }

    @Override
    public boolean onUnbind(Intent i) {
        running = false;
        hideWall();
        if (Admin.owner(this) && !Admin.expired()) Admin.sweep(this, false);
        return false;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent e) {
        if (!Admin.owner(this)) return;
        if (Admin.expired()) { Admin.release(this); disableSelf(); return; }
        // Judge the focused window, not the event source: the notification shade must not drop the wall.
        AccessibilityNodeInfo root = getRootInActiveWindow();
        if (root == null || root.getPackageName() == null) return;
        String pkg = root.getPackageName().toString();
        if (pkg.equals(getPackageName())) return;

        int kind = kinds.computeIfAbsent(pkg, p -> Admin.kind(this, p));
        if (kind == Admin.FULL) {
            Admin.block(this, pkg, true);
            performGlobalAction(GLOBAL_ACTION_HOME);
        }
        if (kind != Admin.PARTIAL) { cartJunk = false; hideWall(); return; }

        AccessibilityNodeInfo pay = find(root, PAY);
        if (pay == null) { cartJunk = false; hideWall(); return; }
        if (!cartJunk) cartJunk = junkInCart(root);
        if (cartJunk) showWall(pay); else hideWall();
    }

    @Override
    public void onInterrupt() {}

    /** A junk name whose card has a quantity stepper (in cart), not an ADD button (a suggestion). */
    static boolean junkInCart(AccessibilityNodeInfo root) {
        for (AccessibilityNodeInfo n : findAll(root, JUNK, new ArrayList<>())) {
            AccessibilityNodeInfo card = n;
            for (int up = 0; up < 6 && card != null; up++, card = card.getParent()) {
                if (find(card, ADD) != null) break;
                if (find(card, QTY) != null) { Log.i(Admin.TAG, "junk in cart: " + text(n)); return true; }
            }
        }
        return false;
    }

    static String text(AccessibilityNodeInfo n) {
        CharSequence t = n.getText() != null ? n.getText() : n.getContentDescription();
        return t == null ? "" : t.toString().trim();
    }

    static AccessibilityNodeInfo find(AccessibilityNodeInfo n, Pattern p) {
        if (n == null) return null;
        if (p.matcher(text(n)).find()) return n;
        for (int i = 0; i < n.getChildCount(); i++) {
            AccessibilityNodeInfo hit = find(n.getChild(i), p);
            if (hit != null) return hit;
        }
        return null;
    }

    static List<AccessibilityNodeInfo> findAll(AccessibilityNodeInfo n, Pattern p,
            List<AccessibilityNodeInfo> out) {
        if (n == null) return out;
        if (p.matcher(text(n)).find()) out.add(n);
        for (int i = 0; i < n.getChildCount(); i++) findAll(n.getChild(i), p, out);
        return out;
    }

    private void showWall(AccessibilityNodeInfo pay) {
        // Cover the whole tappable button (or slider), not just its label.
        for (int up = 0; up < 4 && !pay.isClickable() && pay.getParent() != null; up++) pay = pay.getParent();
        Rect r = new Rect();
        pay.getBoundsInScreen(r);
        if (wall != null && r.equals(wallAt)) return; // unchanged; re-adding would spawn more events
        wallAt.set(r);

        int pad = 48;
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT, r.height() + 2 * pad,
                WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
                        | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                PixelFormat.OPAQUE);
        lp.gravity = Gravity.TOP | Gravity.START;
        lp.y = r.top - pad;
        lp.setFitInsetsTypes(0);
        lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS;

        WindowManager wm = getSystemService(WindowManager.class);
        if (wall == null) {
            wall = new TextView(this);
            wall.setText("Junk in cart. Remove it, then reopen the cart.");
            wall.setTextColor(Color.WHITE);
            wall.setTextSize(16);
            wall.setGravity(Gravity.CENTER);
            wall.setBackgroundColor(0xFFB00020);
            wm.addView(wall, lp);
        } else {
            wm.updateViewLayout(wall, lp);
        }
    }

    private void hideWall() {
        if (wall == null) return;
        getSystemService(WindowManager.class).removeView(wall);
        wall = null;
    }
}
