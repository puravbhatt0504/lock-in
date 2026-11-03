LOCK IN FOOD: Android food-delivery blocker, runs until 1 May 2027
=========================================================================

What it does
  - Blocks these apps outright (greyed out, can't open or uninstall/reinstall):
    Zomato, Swiggy (food), EatSure, EatClub, Toing, Faasos, Behrouz, Box8, Domino's, Pizza Hut,
    McDonald's, KFC, Burger King, Starbucks, Taco Bell, Magicpin, Bistro, Snacc, Zepto Cafe.
    (Matched by app name, so new installs get caught the first time you open them.)
    Plus any app whose name has a food word in it: pizza, burger, biryani, food, momo, bakery, ...
    (Admin.FOOD), so brands not on the list (Mojo Pizza, La Pino'z) are blocked too.
  - Blinkit, Zepto, Swiggy Instamart, BigBasket, JioMart, DMart, Amazon, Flipkart stay usable for
    groceries. If a junk item (chips, chocolate, cold drinks, ice cream, biscuits, Maggi, ...) is in
    your cart, a red bar covers the Pay button. Remove the junk, leave the cart, open it again.
    Note: swiggy.com stays blocked. Use the separate "Swiggy Instamart" app for groceries.
  - Every browser except Chrome is blocked. In Chrome the food and quick-commerce websites are blocked,
    and any site whose address has a food word (mojopizza.in) is sent back and added to the blocklist.
  - If you turn off its Accessibility switch, all the grocery apps and ALL app installs get blocked
    until you turn it back on.
  - After LOCK: USB debugging, date/time changes, factory reset from Settings, safe mode and new users
    are all disabled. The app can't be uninstalled.
  - On 1 May 2027 it removes all of this by itself and you can uninstall it.

  The one escape no app can block: wiping the phone from recovery mode (key combo at boot).
  That wipes everything on the phone.


Setup (about 15 min, phone plugged into this PC)
-------------------------------------------------
  0. Build:  powershell -File build.ps1     (already built: out\lockin-food.apk)
  1. Phone: Settings > About phone > tap "Build number" 7 times. Then Developer options > USB debugging ON.
     Xiaomi/Redmi/Poco: also turn on "USB debugging (Security settings)".
  2. Phone: Settings > Accounts > REMOVE EVERY ACCOUNT (Google, Samsung, Xiaomi, ...).
     Android only lets an app become device owner when there are no accounts. You add them back in step 4.
  3. On this PC, in this folder:
       $adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
       & $adb install -t out\lockin-food.apk
       & $adb shell dpm set-device-owner lockin.food/.Admin
       & $adb shell settings put secure enabled_accessibility_services lockin.food/.Guard
       & $adb shell settings put secure accessibility_enabled 1
     (The settings line replaces any other accessibility apps you had on. Turn those back on by hand.)
  4. Add your accounts back.


Test for a few days BEFORE locking
-----------------------------------
  - Open Zomato: it should be greyed out with "app paused".
  - Blinkit: add chips + milk, open the cart. Red bar over Pay = working. Remove chips,
    go back, open cart again: bar gone.
  - Do the same in Zepto and Instamart. Their screens change often. Watch what it sees:
       & $adb logcat -s lockin
  - Something's wrong (groceries blocked, junk missed)? Edit the lists in src\lockin\food\Admin.java
    (app names, websites) or Guard.java (JUNK words), then  build.ps1  and  & $adb install -r -t out\lockin-food.apk
  - Check the word list still works:  see "Check the junk list" below.
  - Remove completely (only works BEFORE lock):
       & $adb shell dpm remove-active-admin lockin.food/.Admin
       & $adb uninstall lockin.food


LOCK (no undo until 1 May 2027)
-------------------------------
       & $adb shell am broadcast -n lockin.food/.Lock
  After this, adb stops working, so the lists are frozen. Make sure testing went fine first.


Known gaps (to know, not to use)
  - The junk check reads what's on screen. A very long cart with the junk below the fold, never scrolled
    into view, won't trigger the bar.
  - In-app browsers (links opened inside Instagram etc.) aren't covered by the Chrome blocklist.
  - A food brand with no food word in its name or address (like "Subway", which would also catch
    Subway Surfers) still needs adding to FULL_NAMES / SITES by hand.
  - Another phone or a laptop. pc-blocker\ does games, not food sites.


Check the junk list
  $jdk="C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot\bin"; $jar="$env:LOCALAPPDATA\Android\Sdk\platforms\android-35\android.jar"
  & "$jdk\javac.exe" -encoding UTF-8 -cp "$jar;out\classes" -d out\test test\Check.java
  & "$jdk\java.exe" -cp "$jar;out\classes;out\test" lockin.food.Check        -> prints "ok"
