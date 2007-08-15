/*
 *  xpcom-osx-kiosk.h
 *  xpcom-osx-kiosk
 *
 *  $Id: $
 *
 */

#ifndef _XPCOM_OSX_KIOSK_H
#define _XPCOM_OSX_KIOSK_H

//#include <Carbon/Carbon.h>
#include "iOSLock.h"

#define OSLOCK_CID \
{ 0x64ad2d90, 0xb68b, 0x4d5a, \
{ 0x97, 0xa5, 0x39, 0x45, 0x6c, 0xba, 0xbb, 0x92}}

class OSLock : public iOSLock
{
public:
    NS_DECL_ISUPPORTS
    NS_DECL_IOSLOCK
    
    OSLock();
    
private:
    ~OSLock();
    
protected:
    /* additional members */
};

#endif /* _XPCOM_OSX_KIOSK_H */