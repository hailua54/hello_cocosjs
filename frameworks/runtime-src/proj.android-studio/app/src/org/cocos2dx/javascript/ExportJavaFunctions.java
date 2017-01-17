package org.cocos2dx.javascript;

import android.app.Activity;

/**
 * Created by user on 1/16/2017.
 */

public class ExportJavaFunctions {
    public static Activity activity;
    public static int androidGetOrientation()
    {
        return activity.getResources().getConfiguration().orientation;
    }
}
