export const enum ThingUserRoles {
    Administrator = 1,
    User = 2,
    SuperAdministrator = 4// TODO: Maybe you do not need it
}

export const enum ThingUserStatus {
    Ok = 1,
    WaitForAuth = 2
}

export const enum ThingUserVisibility {
    Visible = 1,
    Hidden =  2
}

export const enum ThingDeletedStatus {
    Ok = 1,
    Deleted =  2
}

export const enum ThingUserReadClaims {
    CanReadThingUserChangeClaims = 1,
    CanReadCreationDate = 2,
    CanReadName = 4,
    CanReadDescription = 8,
    CanReadKind = 16,
    CanReadValue = 32,
    CanReadDeletedStatus = 64,
    CanReadThingUserRights = 128,
    CanReadThingUserRole = 256,
    CanReadThingUserStatus = 512,
    CanReadThingUserReadClaims = 1024,
    //CanReadThingUserChangeClaims = 1,
    CanReadPublicReadClaims = 2048,
    CanReadPublicChangeClaims = 4096,
    CanReadEveryoneReadClaims = 8192,
    CanReadEveryoneChangeClaims = 16384,

    NoClaims = 0x0,
    AllClaims = 32767

    /*
        CanReadThingUserChangeClaims |
        CanReadCreationDate | CanReadName |
        CanReadDescription | CanReadKind |
        CanReadValue | CanReadDeletedStatus |
        CanReadThingUserRights | CanReadThingUserRole |
        CanReadThingUserStatus | CanRead |
        CanReadPublicReadClaims | CanReadPublicChangeClaims |
        CanReadEveryoneReadClaims | CanReadEveryoneChangeClaims,
    */
}

export const enum ThingUserChangeClaims {

    CanDeleteThing = 1,
    CanChangeName = 2,
    CanChangeDescription = 4,
    CanChangeKind = 8,
    CanChangeValue = 16,
    CanChangeDeletedStatus = 32,
    CanAddThingUserRights = 64,
    CanDeleteThingUserRights = 128,
    CanChangeThingUserRole = 256,
    CanChangeThingUserStatus = 512,
    CanChangeThingUserReadClaims = 1024,
    CanChange = 2048,
    CanChangePublicReadClaims = 4096,
    CanChangePublicChangeClaims = 8192,
    CanChangeEveryoneReadClaims = 16384,
    CanChangeEveryoneChangeClaims = 32768,
    CanAddChildrenThing = 65536,
    CanRemoveChildrenThing = 131072,

    NoClaims = 0x0,

    AllClaims = 262143,
        /*
        CanDeleteThing |
        CanChangeName | CanChangeDescription |
        CanChangeKind | CanChangeValue |
        CanChangeDeletedStatus | CanAddThingUserRights |
        CanDeleteThingUserRights | CanChangeThingUserRole |
        CanChangeThingUserStatus | CanChangeThingUserReadClaims |
        CanChange | CanChangePublicReadClaims |
        CanChangePublicChangeClaims | CanChangeEveryoneReadClaims |
        CanChangeEveryoneChangeClaims | 
        CanAddChildrenThing | CanRemoveChildrenThing
        */
}