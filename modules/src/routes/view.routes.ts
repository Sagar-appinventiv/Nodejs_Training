export const ViewRoute = [
    {
        method: "GET",
        path: "/",
        handler: async (request: any, h: any) => {
            return h.view('login');
        },
        options: {
            auth: false
        }
    },
    {
        method: "GET",
        path: "/Signup",
        handler: async (request: any, h: any) => {
            return h.view('signup')
        },
        options: {
            auth: false
        }
    },
    {
        method: "GET",
        path: "/forgotPass",
        options: {
            auth: false
        },
        handler: async (request: any, h: any) => {
            return h.view('forgotPass');
        }
    },
    {
        method: "GET",
        path: "/resetPass",
        options: {
            auth: false
        },
        handler: async (request: any, h: any) => {
            return h.view('resetPass');
        }
    },
    {
        method: "GET",
        path: "/profile",
        handler: async (request: any, h: any) => {
            const isUser = JSON.parse(request.query.isUser);
            return h.view('profile', {user: isUser});

        }
    },
    {
        method: "GET",
        path: "/message",
        handler: async (request: any, h: any) => {
            return h.view('message');
        }
    },
    {
        method: "GET",
        path: "/editUserDetails",
        handler: async (request: any, h: any) => {
            return h.view('editUserDetails');
        }
    }
]
