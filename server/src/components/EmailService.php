<?php
namespace Components;

require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $mailer;

    public function __construct() {
        $this->mailer = new PHPMailer(true);
        // Server settings
        $this->mailer->isSMTP();
        $this->mailer->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $this->mailer->SMTPAuth   = true;
        $this->mailer->Username   = getenv('SMTP_USER') ?: 'rhankbrguwdev@gmail.com';
        $this->mailer->Password   = getenv('SMTP_PASS') ?: 'avyn orvh unwg pnrd';
        $this->mailer->SMTPSecure = getenv('SMTP_SECURE') ?: PHPMailer::ENCRYPTION_SMTPS;
        $this->mailer->Port       = getenv('SMTP_PORT') ?: 465;

        // Recipients
        $this->mailer->setFrom(getenv('SMTP_FROM') ?: 'rhankbrguwdev@gmail.com', getenv('SMTP_FROM_NAME') ?: 'Tim El-Ngadu');
    }

    private function getEmailTemplate($title, $content, $actionText = null, $actionUrl = null) {
        $primaryColor = '#0f172a'; // Slate-900
        $secondaryColor = '#eab308'; // Yellow-500
        
        $buttonHtml = '';
        if ($actionText && $actionUrl) {
            $buttonHtml = "
            <div style='text-align: center; margin-top: 30px; margin-bottom: 20px;'>
                <a href='{$actionUrl}' style='background-color: {$primaryColor}; color: {$secondaryColor}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>
                    {$actionText}
                </a>
            </div>";
        }

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #334155; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                .header { background-color: {$primaryColor}; padding: 24px; text-align: center; }
                .header h1 { color: {$secondaryColor}; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
                .content { padding: 32px 24px; line-height: 1.6; }
                .content h2 { color: {$primaryColor}; font-size: 18px; margin-top: 0; }
                .footer { background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>El-Ngadu</h1>
                </div>
                <div class='content'>
                    <h2>{$title}</h2>
                    <div style='margin-bottom: 20px;'>
                        {$content}
                    </div>
                    {$buttonHtml}
                </div>
                <div class='footer'>
                    &copy; " . date('Y') . " Tim El-Ngadu. Hak Cipta Dilindungi.<br>
                    Email ini dibuat secara otomatis, mohon tidak membalas.
                </div>
            </div>
        </body>
        </html>
        ";
    }

    public function sendEmail($to, $subject, $title, $content, $actionText = null, $actionUrl = null) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($to);

            $this->mailer->isHTML(true);
            $this->mailer->Subject = $subject;
            $this->mailer->Body    = $this->getEmailTemplate($title, $content, $actionText, $actionUrl);
            $this->mailer->AltBody = strip_tags(str_replace(['<br>', '<br/>', '</p>'], "\n", $content));

            $this->mailer->send();
            return true;
        } catch (\Throwable $e) {
            // Log error silently to not break JSON response
            error_log("Email tidak dapat dikirim. Pesan Error: {$this->mailer->ErrorInfo} | Exception: {$e->getMessage()}");
            return false;
        }
    }
}
