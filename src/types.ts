export interface IReqUserData {
    user_email: string;
    username: string;
    password: string;
    birthday: Date;
    activationKey: string;
}

export interface IReqTwitData {
    text_of_twit: string;
    likes: number;
    comments: Array<object>;
    date_of_creation: number;
}

export interface IReqCommentData {
    userID: string;
    username: string;
    text_of_comment: string;
    likes: number;
    date_of_creation: number;
}

export interface IUserTokenPayload {
    id: string;
    username: string;
}
