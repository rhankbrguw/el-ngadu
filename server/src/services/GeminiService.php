<?php
namespace Services;

class GeminiService
{
    private string $apiKey;
    private string $apiUrl;

    public function __construct()
    {
        $this->apiKey = \Constants\Config::getGeminiApiKey();
        $this->apiUrl = $_ENV['GEMINI_API_URL'] ?? getenv('GEMINI_API_URL') ?: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    }

    public function chat(string $message): string
    {
        if (!empty($this->apiKey)) {
            try {
                $url = $this->apiUrl . '?key=' . $this->apiKey;
                $payload = $this->buildPayload($message);
                $response = $this->executeRequest($url, $payload);
                $reply = $this->parseResponse($response);
                if (!empty($reply)) {
                    return $reply;
                }
            } catch (\Throwable $e) {
                // Fallback to Knowledge Base Engine on provider failure/geo-block
            }
        }
        return $this->generateKnowledgeFallback($message);
    }

    private function buildPayload(string $message): array
    {
        $prompt = "Anda adalah CS AI resmi platform El-Ngadu. Jawab ramah dan ringkas. Tanpa simbol asteris (*). Jam kerja: Senin-Jumat 08:00-16:00. Alur: Daftar -> Tulis Pengaduan -> Verifikasi -> Proses -> Selesai.";
        return [
            "systemInstruction" => ["parts" => [["text" => $prompt]]],
            "contents" => [["parts" => [["text" => $message]]]],
            "generationConfig" => [
                "temperature" => \Constants\Config::GEMINI_TEMP,
                "maxOutputTokens" => \Constants\Config::GEMINI_MAX_TOKENS
            ]
        ];
    }

    private function executeRequest(string $url, array $payload): ?string
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $httpCode === 200 && is_string($response) ? $response : null;
    }

    private function parseResponse(?string $response): ?string
    {
        if (!$response) return null;
        $data = json_decode($response, true);
        return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
    }

    private function generateKnowledgeFallback(string $message): string
    {
        $m = strtolower($message);
        if (preg_match('/(jam|waktu|operasional|buka|tutup|kerja)/i', $m)) {
            return "Layanan El-Ngadu beroperasi setiap hari Senin hingga Jumat, pukul 08:00 - 16:00 WIB. Pengaduan yang masuk di luar jam kerja akan diproses pada hari kerja berikutnya.";
        }
        if (preg_match('/(alur|cara|prosedur|tahap|buat|lapor|tulis)/i', $m)) {
            return "Alur pengaduan di El-Ngadu:\n1. Daftar / Masuk ke akun Anda\n2. Klik menu 'Tulis Pengaduan'\n3. Isi judul, detail laporan, dan lampirkan bukti foto\n4. Petugas akan memverifikasi laporan Anda dalam 1x24 jam\n5. Status akan berubah menjadi 'Proses' hingga 'Selesai'.";
        }
        if (preg_match('/(status|cek|pending|verifikasi|proses|selesai)/i', $m)) {
            return "Anda dapat memantau status pengaduan secara real-time melalui menu 'Riwayat Pengaduan' di dashboard. Status yang tersedia: Pending, Proses, dan Selesai.";
        }
        if (preg_match('/(halo|hai|selamat|pagi|siang|sore|malam)/i', $m)) {
            return "Halo! Selamat datang di Layanan Bantuan El-Ngadu. Ada yang bisa saya bantu terkait laporan atau pengaduan masyarakat?";
        }
        return "Terima kasih telah menghubungi Layanan Bantuan El-Ngadu. Anda dapat membuat pengaduan baru melalui dashboard atau mengecek status laporan yang sedang diproses oleh petugas kami.";
    }
}
