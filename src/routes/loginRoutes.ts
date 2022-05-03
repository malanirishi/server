import { Router, Request, Response, NextFunction } from "express";

const router = Router();

interface RequestWithBody extends Request {
    body: { [key:string]: string|undefined };
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session?.loggedIn) {
        next();
        return;
    }
    res.status(403);
    res.send('Not Permitted');
}

router.get('/login', (req, res) => {
    res.send(`
        <form method="post">
            <div>
                <label>Email:</label>
                <input name="email" type="text"/> 
            </div>
            <div>
                <label>Password</label>
                <input name="password" type="password"/>
            </div>
            <button type="submit">Submit</button>
        </form>
    `);
});

router.post('/login', (req: RequestWithBody, res: Response) => {
    const { email, password } = req.body;
    if (email && password && email === 'test' && password === 'pass') {
        req.session = { loggedIn: true };
        res.redirect('/');
    } else {
        res.send('Invalid email or password');
    }
});

router.get('/', (req: Request, res: Response) => {
    if (req.session?.loggedIn) {
        res.send(`
            <div> You are logged in </div>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <div> You are not logged in </div>
            <a href="/login">Login</a>
        `);
    }
});

router.get('/logout', (req: Request, res: Response) => {
    req.session = undefined;
    res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
    res.send('You are in protected route, logged in user');
});

export { router };
