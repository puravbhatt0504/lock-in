package lockin.food;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/** adb shell am broadcast -n lockin.food/.Lock  -- one way. After this, adb itself is disabled. */
public class Lock extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent i) {
        if (!Admin.owner(c)) { Log.w(Admin.TAG, "not device owner, nothing locked"); return; }
        for (String r : Admin.LOCKS) Admin.dpm(c).addUserRestriction(Admin.admin(c), r);
        Admin.dpm(c).setAutoTimeEnabled(Admin.admin(c), true); // no winding the clock to May
        if (!Guard.running) Admin.sweep(c, false);
        Log.i(Admin.TAG, "LOCKED until 1 May 2027");
    }
}
