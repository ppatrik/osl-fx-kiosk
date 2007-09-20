/*
 *  xpcom-osx-kiosk.cpp
 *  xpcom-osx-kiosk
 *
 *  $Id$
 *
 */

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
    //struct Point foo;
    //foo.v = 100;
    //foo.h = 100;
    WindowRef currentWin = FrontWindow();
    //WindowRef currentWin;
    //FindWindow(foo, &currentWin);
    //SetWindowGroupLevel(GetWindowGroup(currentWin), 62);
    //SetWindowGroupLevel(GetWindowGroupOfClass(kDocumentWindowClass), 62);
    //ChangeWindowAttributes(currentWin, kWindowNoTitleBarAttribute,
    //    kWindowResizableAttribute);
    HideWindow(currentWin);    
    SetSystemUIMode(kUIModeAllHidden, kUIOptionDisableAppleMenu |
        kUIOptionDisableProcessSwitch //|
        //kUIOptionDisableForceQuit);
        );
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