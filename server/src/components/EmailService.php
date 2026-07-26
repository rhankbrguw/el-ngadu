<?php
namespace Components;

require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use Constants\DesignTokens;

class EmailService {
    private PHPMailer $mailer;

    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->mailer->isSMTP();
        $this->mailer->Host       = $_ENV['SMTP_HOST'] ?? getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $this->mailer->SMTPAuth   = true;
        $this->mailer->Username   = $_ENV['SMTP_USER'] ?? getenv('SMTP_USER') ?: '';
        $this->mailer->Password   = $_ENV['SMTP_PASS'] ?? getenv('SMTP_PASS') ?: '';
        $this->mailer->SMTPSecure = $_ENV['SMTP_SECURE'] ?? getenv('SMTP_SECURE') ?: PHPMailer::ENCRYPTION_SMTPS;
        $this->mailer->Port       = (int)($_ENV['SMTP_PORT'] ?? getenv('SMTP_PORT') ?: 465);

        $this->mailer->setFrom($_ENV['SMTP_FROM'] ?? getenv('SMTP_FROM') ?: 'noreply@example.com', $_ENV['SMTP_FROM_NAME'] ?? getenv('SMTP_FROM_NAME') ?: 'Tim El-Ngadu');
    }

    private function buildActionButton(?string $text, ?string $url): string {
        if (!$text || !$url) {
            return '';
        }
        $primary = DesignTokens::COLOR_DARK;
        $secondary = DesignTokens::COLOR_PRIMARY;
        return "<div style='text-align: center; margin-top: 30px; margin-bottom: 20px;'>
            <a href='{$url}' style='background-color: {$primary}; color: {$secondary}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>{$text}</a>
        </div>";
    }

    private function getEmailTemplate(string $title, string $content, ?string $actionText = null, ?string $actionUrl = null): string {
        $buttonHtml = $this->buildActionButton($actionText, $actionUrl);
        $primary = DesignTokens::COLOR_DARK;
        $secondary = DesignTokens::COLOR_PRIMARY;
        $bgBody = DesignTokens::COLOR_BG_BODY;
        $bgCard = DesignTokens::COLOR_BG_CARD;
        $textBody = DesignTokens::COLOR_TEXT_BODY;
        $border = DesignTokens::COLOR_BORDER;
        $bgFooter = DesignTokens::COLOR_BG_FOOTER;
        $textMuted = DesignTokens::COLOR_TEXT_MUTED;
        $year = date('Y');

        return "<!DOCTYPE html><html><head><meta charset='utf-8'>
        <style>
            body { font-family: 'Inter', sans-serif; background-color: {$bgBody}; margin: 0; padding: 20px; color: {$textBody}; }
            .container { max-width: 600px; margin: 0 auto; background-color: {$bgCard}; border-radius: 8px; overflow: hidden; border: 1px solid {$border}; }
            .header { background-color: {$primary}; padding: 24px; text-align: center; }
            .header h1 { color: {$secondary}; margin: 0; font-size: 24px; font-weight: 700; }
            .content { padding: 32px 24px; line-height: 1.6; }
            .content h2 { color: {$primary}; font-size: 18px; margin-top: 0; }
            .footer { background-color: {$bgFooter}; padding: 16px 24px; text-align: center; font-size: 13px; color: {$textMuted}; border-top: 1px solid {$border}; }
        </style></head>
        <body><div class='container'><div class='header'><h1>El-Ngadu</h1></div><div class='content'><h2>{$title}</h2><div style='margin-bottom: 20px;'>{$content}</div>{$buttonHtml}</div><div class='footer'>&copy; {$year} Tim El-Ngadu. Hak Cipta Dilindungi.<br>Email ini dibuat secara otomatis, mohon tidak membalas.</div></div></body></html>";
    }

    public function sendEmail(string $to, string $subject, string $title, string $content, ?string $actionText = null, ?string $actionUrl = null): bool {
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
            error_log("EmailService::sendEmail failed: {$this->mailer->ErrorInfo} | Exception: {$e->getMessage()}");
            return false;
        }
    }
}
