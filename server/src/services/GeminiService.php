<?php
namespace Services;

class GeminiService
{
    private $apiKey;
    private $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-robotics-er-1.6-preview:generateContent';

    public function __construct()
    {
        $this->apiKey = $_ENV['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?: '';
        if (empty($this->apiKey)) {
            throw new \Exception("Gemini API Key is missing");
        }
    }

    public function chat(string $message): string
    {
        $url = $this->apiUrl . '?key=' . $this->apiKey;
        $payload = $this->buildPayload($message);

        $response = $this->executeRequest($url, $payload);
        return $this->parseResponse($response);
    }

    private function buildPayload(string $message): array
    {
        $systemPrompt = "Anda adalah Customer Support AI profesional untuk platform 'El-Ngadu'. Jawab ringkas dan seperlunya. JANGAN gunakan markdown asteris (*) atau (**). Gunakan dash (-) untuk bullet points. Jam kerja: Senin-Jumat 08:00-16:00. Alur pengaduan: Daftar -> Login -> Tulis -> Verifikasi -> Proses -> Selesai.";

        return [
            "systemInstruction" => [
                "parts" => [["text" => $systemPrompt]]
            ],
            "contents" => [
                [
                    "parts" => [["text" => $message]]
                ]
            ],
            "generationConfig" => [
                "temperature" => 0.3,
                "maxOutputTokens" => 800
            ]
        ];
    }

    private function executeRequest(string $url, array $payload): string
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \Exception("Gagal menghubungi AI Server.");
        }

        return $response;
    }

    private function parseResponse(string $response): string
    {
        $responseData = json_decode($response, true);
        
        if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
            return $responseData['candidates'][0]['content']['parts'][0]['text'];
        }

        return "Maaf, saya tidak dapat merespon saat ini.";
    }
}
