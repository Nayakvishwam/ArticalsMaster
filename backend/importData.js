const { models } = require("./config/dbConnection");
const { hashPassword } = require("./utils/utils");

// Main import function
async function importData() {
    try {
        // Make sure models are synced (optional: use only if tables already exist)
        // await sequelize.sync({ force: true });

        await models.users.bulkCreate([{
            email: 'vishwamnayak88@gmail.com',
            name: 'Nayak vishwam',
            password: await hashPassword('vishwamnayak7069'),
            role: 'admin',
            isActive: true
        }], { ignoreDuplicates: true });
        console.log('Users imported');

        await models.services.bulkCreate([{
            name: 'email',
            is_active: true
        }], { ignoreDuplicates: true });
        console.log('Services imported');

        await models.emailTasks.bulkCreate(
            [
                {
                    name: "user_verification",
                    content: "<div style=\"font-family: Arial, sans-serif; line-height: 1.6;\"><h2>Welcome {{name}}!</h2><p>Thank you for registering on our platform.</p><p>Please verify your email by clicking the button below:</p><p><a href=\"{{verification_link}}\" style=\"background-color:#007BFF; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;\">Verify Email</a></p><p>If the button doesn't work, copy and paste this link into your browser:</p><p>{{verification_link}}</p><hr /><p>Best regards,<br/>The Team</p></div>"
                }
            ], { ignoreDuplicates: true }
        );
        console.log('Email tasks imported');

    } catch (error) {
        console.error('Error importing data:', error);
    }
}

importData();