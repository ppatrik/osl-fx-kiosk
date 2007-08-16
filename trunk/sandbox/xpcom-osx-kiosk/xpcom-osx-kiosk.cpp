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
    return NS_ERROR_NOT_IMPLEMENTED;
}

/* void hidedecor (); */
NS_IMETHODIMP OSLock::Hidedecor()
{
    SetSystemUIMode(kUIModeAllHidden, kUIOptionDisableAppleMenu |
        kUIOptionDisableProcessSwitch |
        kUIOptionDisableForceQuit);
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