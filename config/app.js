module.exports = {
    appPort: process.env.PORT || 3000,
    moungoUri: 'mongodb+srv://MishaSokil:Warmisha_333444@todos.fhsuf.mongodb.net/todos',
    jwt: {
        secret: 'Forest228Forest',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '2m'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '7d'
            }
        }
    }
};