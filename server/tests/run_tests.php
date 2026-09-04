<?php
/**
 * Automated Test Runner for El-Ngadu Backend
 */

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/core/init.php';

class TestRunner {
    private int $passed = 0;
    private int $failed = 0;
    private array $failures = [];

    public function assert(bool $condition, string $testName): void {
        if ($condition) {
            $this->passed++;
            echo "  \033[32m✔ PASS\033[0m: {$testName}\n";
        } else {
            $this->failed++;
            $this->failures[] = $testName;
            echo "  \033[31m✖ FAIL\033[0m: {$testName}\n";
        }
    }

    public function assertEquals($expected, $actual, string $testName): void {
        $this->assert($expected === $actual, "{$testName} (Expected " . var_export($expected, true) . ", got " . var_export($actual, true) . ")");
    }

    public function run(): void {
        $startTime = microtime(true);
        echo "\n=======================================================\n";
        echo "       EL-NGADU BACKEND AUTOMATED TEST SUITE          \n";
        echo "=======================================================\n\n";

        $this->testExceptions();
        $this->testValidator();
        $this->testDatabaseAndRepositories();
        $this->testServices();
        $this->testCache();

        $elapsed = round((microtime(true) - $startTime) * 1000, 2);

        echo "\n-------------------------------------------------------\n";
        echo "Results: {$this->passed} Passed, {$this->failed} Failed ({$elapsed} ms)\n";
        echo "-------------------------------------------------------\n\n";

        if ($this->failed > 0) {
            echo "FAILED TESTS:\n";
            foreach ($this->failures as $failure) {
                echo " - {$failure}\n";
            }
            exit(1);
        }
    }

    private function testExceptions(): void {
        echo "▶ Testing Core Exception Hierarchy...\n";
        $valEx = new \Core\ValidationException('Invalid', ['field' => 'error']);
        $this->assertEquals(422, $valEx->getStatusCode(), 'ValidationException status code is 422');
        $this->assertEquals(['field' => 'error'], $valEx->getValidationErrors(), 'ValidationException errors match');

        $unauthEx = new \Core\UnauthorizedException();
        $this->assertEquals(401, $unauthEx->getStatusCode(), 'UnauthorizedException status code is 401');

        $forbidEx = new \Core\ForbiddenException();
        $this->assertEquals(403, $forbidEx->getStatusCode(), 'ForbiddenException status code is 403');

        $notfoundEx = new \Core\NotFoundException();
        $this->assertEquals(404, $notfoundEx->getStatusCode(), 'NotFoundException status code is 404');

        $conflictEx = new \Core\ConflictException();
        $this->assertEquals(409, $conflictEx->getStatusCode(), 'ConflictException status code is 409');

        $internalEx = new \Core\InternalException();
        $this->assertEquals(500, $internalEx->getStatusCode(), 'InternalException status code is 500');
    }

    private function testValidator(): void {
        echo "\n▶ Testing AppValidator & Schema Validation...\n";
        $v1 = \Core\AppValidator::make(
            ['username' => 'test', 'email' => 'user@gmail.co', 'nama' => 'User123', 'telp' => 'abc', 'nik' => '12345'],
            ['username' => 'required', 'email' => 'required|email|trusted_email', 'nama' => 'required|valid_name', 'telp' => 'required|valid_phone', 'nik' => 'required|valid_nik']
        );
        $v1->validate();
        $this->assert($v1->fails(), 'Validator catches strict rule violations');
        $errors = $v1->errors()->firstOfAll();
        $this->assert(isset($errors['email']), 'Validator catches .co email typo');
        $this->assert(isset($errors['nama']), 'Validator catches name with numbers');
        $this->assert(isset($errors['telp']), 'Validator catches non-numeric phone');
        $this->assert(isset($errors['nik']), 'Validator catches non-16-digit NIK');

        $v2 = \Core\AppValidator::make(
            ['username' => 'validuser', 'email' => 'test@gmail.com', 'nama' => 'Budi Santoso', 'telp' => '081234567890', 'nik' => '3201012345678901'],
            ['username' => 'required|min:3', 'email' => 'required|email|trusted_email', 'nama' => 'required|valid_name', 'telp' => 'required|valid_phone', 'nik' => 'required|valid_nik']
        );
        $v2->validate();
        $this->assert(!$v2->fails(), 'Validator passes on valid input');
    }


    private function testDatabaseAndRepositories(): void {
        echo "\n▶ Testing Database Connection & Repositories...\n";
        $pdo = \Components\Database::connect();
        $this->assert($pdo instanceof \PDO, 'Database returns PDO instance');

        $officerRepo = new \Repositories\OfficerRepository();
        $officerCount = $officerRepo->getCount();
        $this->assert(is_int($officerCount), 'OfficerRepository getCount returns integer');

        $citizenRepo = new \Repositories\CitizenRepository();
        $citizenCount = $citizenRepo->getCount();
        $this->assert(is_int($citizenCount), 'CitizenRepository getCount returns integer');

        $complaintRepo = new \Repositories\ComplaintRepository();
        $allComplaints = $complaintRepo->getAll(10, 0);
        $this->assert(is_array($allComplaints), 'ComplaintRepository getAll returns array');

        $statsRepo = new \Repositories\StatsRepository();
        $stats = $statsRepo->getPengaduanStats();
        $this->assert(is_array($stats), 'StatsRepository getPengaduanStats returns array');
    }

    private function testServices(): void {
        echo "\n▶ Testing Service Layer Contracts...\n";
        $citizenService = new \Services\CitizenService();
        $citizens = $citizenService->getAll(1, 5);
        $this->assert(isset($citizens['pagination']), 'CitizenService returns pagination metadata');
        $this->assert(isset($citizens['data']), 'CitizenService returns data collection');

        $complaintReadService = new \Services\ComplaintReadService();
        $mine = $complaintReadService->getMine('non_existent_nik', 1, 10);
        $this->assert(isset($mine['data']), 'ComplaintReadService getMine returns data');
        $this->assert(isset($mine['pagination']), 'ComplaintReadService getMine returns pagination');
    }

    private function testCache(): void {
        echo "\n▶ Testing Multi-Tier Cache Component...\n";
        \Components\Cache::set('test_key', 'test_value', 10);
        $this->assertEquals('test_value', \Components\Cache::get('test_key'), 'Cache set and get works');
        $val1 = \Components\Cache::remember('test_rem', 10, fn() => 'computed');
        $this->assertEquals('computed', $val1, 'Cache remember computes initial value');
        $val2 = \Components\Cache::remember('test_rem', 10, fn() => 'recomputed');
        $this->assertEquals('computed', $val2, 'Cache remember serves cached hit');
        \Components\Cache::delete('test_key');
        $this->assertEquals(null, \Components\Cache::get('test_key'), 'Cache delete invalidates key');
    }
}


$runner = new TestRunner();
$runner->run();
