<?php
namespace Components;

require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use Constants\Config;
use Constants\DesignTokens;

class EmailService {
    private PHPMailer $mailer;
    private static ?self $instance = null;

    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->configureSmtp();
        $this->configureIdentity();
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function configureSmtp(): void {
        $smtpConfig = Config::getSmtpConfig();
        $isDev = Config::isDev();

        $this->mailer->isSMTP();
        // Force IPv4 resolution to prevent IPv6 connection timeouts
        $this->mailer->Host       = gethostbyname($smtpConfig['host']);
        $this->mailer->SMTPAuth   = true;
        $this->mailer->Username   = $smtpConfig['user'];
        $this->mailer->Password   = $smtpConfig['pass'];
        $this->mailer->Port       = $smtpConfig['port'];
        $this->mailer->SMTPKeepAlive = true;

        $this->mailer->Timeout         = Config::SMTP_TIMEOUT_SECONDS;
        $this->mailer->SMTPOptions     = $isDev
            ? ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true]]
            : [];

        $this->resolveEncryption($smtpConfig['port'], $smtpConfig['secure']);
    }

    private function resolveEncryption(int $port, string $secure): void {
        if ($secure === 'tls' || $port === 587) {
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            return;
        }
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    }

    private function configureIdentity(): void {
        $smtpConfig = Config::getSmtpConfig();
        $this->mailer->setFrom($smtpConfig['from'], $smtpConfig['from_name']);
    }

    private function buildActionButton(?string $text, ?string $url): string {
        if (!$text || !$url) {
            return '';
        }
        $bg = DesignTokens::COLOR_DARK;
        $fg = DesignTokens::COLOR_PRIMARY;
        return "<div style='text-align: center; margin-top: 30px; margin-bottom: 20px;'>
            <a href='{$url}' style='background-color: {$bg}; color: {$fg}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>{$text}</a>
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

    public function sendEmailAsync(string $to, string $subject, string $title, string $content, ?string $actionText = null, ?string $actionUrl = null): bool {
        $payload = json_encode([
            'to' => $to,
            'subject' => $subject,
            'title' => $title,
            'content' => $content,
            'actionText' => $actionText,
            'actionUrl' => $actionUrl
        ]);
        
        $tempFile = sys_get_temp_dir() . '/email_payload_' . uniqid() . '.json';
        file_put_contents($tempFile, $payload);
        
        $cliScript = realpath(__DIR__ . '/EmailWorker.php');
        if ($cliScript) {
            $cmd = "php " . escapeshellarg($cliScript) . " " . escapeshellarg($tempFile) . " > /dev/null 2>&1 &";
            exec($cmd);
            return true;
        }
        
        return $this->sendEmail($to, $subject, $title, $content, $actionText, $actionUrl);
    }
}
