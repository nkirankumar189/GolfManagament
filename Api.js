const Path = {
    BaseUrl: "http://115.247.223.165/provnetwork/api/v1/",
    login: "login",
    getMyProfile: "getMyProfile",
    updateMyProfile: "updateMyProfile",
    logout: "logout",
    forgotPassWord: "forgot-password",
    verifyOtp: "verify-otp",
    reset_password: "reset-password",
    allGroups: "getGroups?per_page=10",
    group_Details: "getGroupDetails",
    allMembers: "getMembersByGroup",
    member_signup: "member/signup",
    createMember: "member/signup/update/details",
    getBusinessSector: "getBusinessSector",
    CreatePaymentIntent: "create-payment-intent",
    dateBygroupID: "getDatesByGroupId",
    viewDates: "getViewDates",
    getBusinessSector: "getBusinessSector",
    memberData: "getMemberById",
    verify_otp: "member/signup/verify/otp",
    settings_keys: "settings/keys",
    subscription_create: "member/subscription/create",
    password_update: "member/signup/password/update",
    inviteGuest:"my_group/inviteGuest",
    payGreenFees:"other_group/payGreenFees"

}
export default Path; // Export the Path object