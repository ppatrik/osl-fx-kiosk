/*
 *  xpcom-osx-kiosk.cpp
 *  xpcom-osx-kiosk
 *
 *  $Id$
 *
 */

#include <stdio.h>
#include "nsIGenericFactory.h"
#include "xpcom-osx-kiosk.h"

NS_IMPL_ISUPPORTS1(OSLock, iOSLock)

OSLock::OSLock()
{
    /* member initializers and constructor code */
}

OSLock::~OSLock()
{
    /* destructor code */
}

/* void lock (); */
NS_IMETHODIMP OSLock::Lock()
{
    WindowRef maskWindow = NULL;
    Rect winRect;
    winRect.top = 0;
    winRect.left = 0;
    winRect.bottom = GetMBarHeight();
    winRect.right = CGDisplayPixelsWide(CGMainDisplayID());
    CreateNewWindow(kOverlayWindowClass, kWindowOpaqueForEventsAttribute |
                    kWindowDoesNotCycleAttribute,
                    &winRect, &maskWindow);
    if (maskWindow == NULL) {
        printf("maskWindow is NULL\n");
    } else {
        if (ChangeWindowAttributes(maskWindow, kWindowNoAttributes,
                                   kWindowHideOnFullScreenAttribute) != 0) {
            printf("Unable to remove kWindowHideOnFullScreenAttribute!\n");
        }
        ShowWindow(maskWindow);
    }
    
    SetSystemUIMode(kUIModeAllHidden, kUIOptionDisableAppleMenu |
                    kUIOptionDisableProcessSwitch); // | kUIOptionDisableForceQuit);

    //CGCaptureAllDisplays();
    return NS_OK;
}

/* void unlock (); */
NS_IMETHODIMP OSLock::Unlock()
{
    SetSystemUIMode(kUIModeNormal, NULL);
    //CGReleaseAllDisplays();
    return NS_OK;
}

NS_GENERIC_FACTORY_CONSTRUCTOR(OSLock);

static const nsModuleComponentInfo components[] =
{
    {
        "Operating System Lockdown",
        OSLOCK_CID,
        "@osuosl.org/OSLock",
        OSLockConstructor
    }
};

NS_IMPL_NSGETMODULE(nsOSLockModule, components)