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
        $this->mailer->Host       = $smtpConfig['host'];
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
        return "<table role='presentation' border='0' cellspacing='0' cellpadding='0' align='center' style='margin:24px auto 16px auto;'><tr><td align='center' bgcolor='{$bg}' style='border-radius:6px;'><a href='{$url}' style='background-color:{$bg};color:{$fg};padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;font-size:14px;font-family:sans-serif;'>{$text}</a></td></tr></table>";
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

        return "<!DOCTYPE html><html lang='id'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>{$title}</title></head><body style='margin:0;padding:0;background-color:{$bgBody};font-family:sans-serif;' bgcolor='{$bgBody}'><table role='presentation' width='100%' border='0' cellspacing='0' cellpadding='0' bgcolor='{$bgBody}' style='background-color:{$bgBody};padding:24px 12px;'><tr><td align='center'><table role='presentation' width='100%' border='0' cellspacing='0' cellpadding='0' bgcolor='{$bgCard}' style='max-width:560px;background-color:{$bgCard};border-radius:8px;overflow:hidden;border:1px solid {$border};'><tr><td bgcolor='{$primary}' align='center' style='background-color:{$primary};padding:20px;'><h1 style='color:{$secondary};margin:0;font-size:22px;font-weight:700;letter-spacing:0.5px;font-family:sans-serif;'>El-Ngadu</h1></td></tr><tr><td style='padding:28px 24px;line-height:1.6;color:{$textBody};font-size:14px;font-family:sans-serif;'><h2 style='color:{$primary};font-size:17px;margin:0 0 16px 0;font-weight:600;'>{$title}</h2><div style='margin-bottom:16px;'>{$content}</div>{$buttonHtml}</td></tr><tr><td bgcolor='{$bgFooter}' align='center' style='background-color:{$bgFooter};padding:16px 20px;text-align:center;font-size:12px;color:{$textMuted};border-top:1px solid {$border};font-family:sans-serif;'>&copy; {$year} Tim El-Ngadu. Hak Cipta Dilindungi.<br>Email ini dibuat otomatis, mohon tidak membalas.</td></tr></table></td></tr></table></body></html>";
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
