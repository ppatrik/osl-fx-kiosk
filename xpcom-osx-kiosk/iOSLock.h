/*
 * DO NOT EDIT.  THIS FILE IS GENERATED FROM iOSLock.idl
 */

#ifndef __gen_iOSLock_h__
#define __gen_iOSLock_h__


#ifndef __gen_nsISupports_h__
#include "nsISupports.h"
#endif

/* For IDL files that don't want to include root IDL files. */
#ifndef NS_NO_VTABLE
#define NS_NO_VTABLE
#endif

/* starting interface:    iOSLock */
#define IOSLOCK_IID_STR "343da8a5-581e-477e-8e70-3dddd8ae8010"

#define IOSLOCK_IID \
  {0x343da8a5, 0x581e, 0x477e, \
    { 0x8e, 0x70, 0x3d, 0xdd, 0xd8, 0xae, 0x80, 0x10 }}

class NS_NO_VTABLE iOSLock : public nsISupports {
 public: 

  NS_DEFINE_STATIC_IID_ACCESSOR(IOSLOCK_IID)

  /* void lock (); */
  NS_IMETHOD Lock(void) = 0;

  /* void unlock (); */
  NS_IMETHOD Unlock(void) = 0;

};

/* Use this macro when declaring classes that implement this interface. */
#define NS_DECL_IOSLOCK \
  NS_IMETHOD Lock(void); \
  NS_IMETHOD Unlock(void); 

/* Use this macro to declare functions that forward the behavior of this interface to another object. */
#define NS_FORWARD_IOSLOCK(_to) \
  NS_IMETHOD Lock(void) { return _to Lock(); } \
  NS_IMETHOD Unlock(void) { return _to Unlock(); } 

/* Use this macro to declare functions that forward the behavior of this interface to another object in a safe way. */
#define NS_FORWARD_SAFE_IOSLOCK(_to) \
  NS_IMETHOD Lock(void) { return !_to ? NS_ERROR_NULL_POINTER : _to->Lock(); } \
  NS_IMETHOD Unlock(void) { return !_to ? NS_ERROR_NULL_POINTER : _to->Unlock(); } 

#if 0
/* Use the code below as a template for the implementation class for this interface. */

/* Header file */
class _MYCLASS_ : public iOSLock
{
public:
  NS_DECL_ISUPPORTS
  NS_DECL_IOSLOCK

  _MYCLASS_();

private:
  ~_MYCLASS_();

protected:
  /* additional members */
};

/* Implementation file */
NS_IMPL_ISUPPORTS1(_MYCLASS_, iOSLock)

_MYCLASS_::_MYCLASS_()
{
  /* member initializers and constructor code */
}

_MYCLASS_::~_MYCLASS_()
{
  /* destructor code */
}

/* void lock (); */
NS_IMETHODIMP _MYCLASS_::Lock()
{
    return NS_ERROR_NOT_IMPLEMENTED;
}

/* void unlock (); */
NS_IMETHODIMP _MYCLASS_::Unlock()
{
    return NS_ERROR_NOT_IMPLEMENTED;
}

/* End of implementation class template. */
#endif


#endif /* __gen_iOSLock_h__ */
