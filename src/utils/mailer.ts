import fileSystem from 'fs/promises';
import nodemailer, {
    SendMailOptions, Transporter,
} from 'nodemailer';

/**
 * Configures the email transporter for sending emails using Gmail SMTP.
 * This function sets up the nodemailer transporter with Gmail's SMTP server and
 * authentication details.
 *
 * @returns A configured nodemailer Transporter instance.
 */
const transporter: Transporter = nodemailer.createTransport({
    auth: {
        pass: process.env.PASS,
        user: process.env.EMAIL,
    },
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
});

/**
* Load and fill HTML template.
* @param filePath - HTML path.
* @param data - Data to fill template.
* @returns - Email fullfilled.
*/
async function loadTemplate(
    data: Record<string, string>,
    filePath: string,
):
    Promise<string> {
    try {
        const template = await fileSystem.readFile(filePath, 'utf8');
        return template.replace(/{{(.*?)}}/g, (_, key) => {
            return data[key.trim()] || '';
        });
    } catch (error: any) {
        throw new Error(`Error loading html file: ${error.message}`);
    }
}

/**
 * Send a Email with a custom template.
 * @param emailOptions - Email options.
 * @param templatePath - HTML path.
 * @param templateData - Template data.
 */
export default async function sendAlert(
    emailOptions: Omit<SendMailOptions, 'html'>,
    templatePath: string,
    templateData: Record<string, string>,
):
    Promise<void> {
    try {
        const htmlContent = await loadTemplate(templateData, templatePath);
        await transporter.sendMail({ ...emailOptions, html: htmlContent });
    } catch (error: any) {
        console.error(error.message || error);
        throw new Error('Error sending email alert');
    }
}
