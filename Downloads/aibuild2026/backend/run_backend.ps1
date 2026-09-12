# NetworkIQ Local Maven & Java Bootstrapper
$MavenVersion = "3.8.8"
$LocalBinDir = Join-Path $PSScriptRoot ".maven_bin"
$ZipFile = Join-Path $PSScriptRoot "maven.zip"
$MvnPath = Join-Path $LocalBinDir "apache-maven-$MavenVersion\bin\mvn.cmd"

# --- Java JDK Validation and Autodetection ---
$JavaHomeValid = $false

# 1. Inspect existing JAVA_HOME
if ($env:JAVA_HOME) {
    if ($env:JAVA_HOME -like "*\bin" -or $env:JAVA_HOME -like "*\bin\") {
        $env:JAVA_HOME = Split-Path $env:JAVA_HOME -Parent
    }
    
    # Verify java.exe exists in the configured JAVA_HOME
    $CheckPath = Join-Path $env:JAVA_HOME "bin\java.exe"
    if (Test-Path $CheckPath) {
        $JavaHomeValid = $true
        Write-Host "Verified active JAVA_HOME at: $env:JAVA_HOME" -ForegroundColor Green
    } else {
        Write-Host "Configured JAVA_HOME ($env:JAVA_HOME) is invalid (java.exe not found)." -ForegroundColor Yellow
        $env:JAVA_HOME = $null  # Clear it to trigger autodetection
    }
}

# 2. Autodetect Java via system PATH
if (-not $JavaHomeValid) {
    Write-Host "Searching system PATH for java.exe..." -ForegroundColor Yellow
    $JavaCmd = Get-Command java -ErrorAction SilentlyContinue
    if ($JavaCmd) {
        $JavaPath = $JavaCmd.Source
        # Strip bin/java.exe
        $JdkHome = Split-Path (Split-Path $JavaPath -Parent) -Parent
        $CheckPath = Join-Path $JdkHome "bin\java.exe"
        if (Test-Path $CheckPath) {
            $env:JAVA_HOME = $JdkHome
            $JavaHomeValid = $true
            Write-Host "Detected working Java JDK in system PATH: $env:JAVA_HOME" -ForegroundColor Green
        }
    }
}

# 3. Autodetect Java via typical installation paths
if (-not $JavaHomeValid) {
    Write-Host "Searching standard Windows program directories for JDKs..." -ForegroundColor Yellow
    $StandardPaths = @(
        "C:\Program Files\Java",
        "C:\Program Files\Eclipse Adoptium",
        "C:\Program Files\Amazon Corretto",
        "C:\Program Files\Microsoft",
        "C:\Program Files (x86)\Java"
    )
    
    foreach ($Path in $StandardPaths) {
        if (Test-Path $Path) {
            # Find any folders inside that have a bin/java.exe
            $SubDirs = Get-ChildItem -Path $Path -Directory
            foreach ($Dir in $SubDirs) {
                $CheckPath = Join-Path $Dir.FullName "bin\java.exe"
                if (Test-Path $CheckPath) {
                    $env:JAVA_HOME = $Dir.FullName
                    $JavaHomeValid = $true
                    Write-Host "Located working Java JDK at: $env:JAVA_HOME" -ForegroundColor Green
                    break
                }
            }
        }
        if ($JavaHomeValid) { break }
    }
}

# 4. Final Fallback warning if no JDK found
if (-not $JavaHomeValid) {
    Write-Host "[ERROR] No Java JDK installation could be located on this machine." -ForegroundColor Red
    Write-Host "Please download and install Java JDK 17 (or higher) from Eclipse Adoptium (https://adoptium.net/) or Oracle, then try again." -ForegroundColor Yellow
    exit 1
}

# --- Maven Verification ---
if (-not (Test-Path $MvnPath)) {
    Write-Host "Local Maven not found. Downloading Apache Maven $MavenVersion..." -ForegroundColor Cyan
    $Url = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
    try {
        Invoke-WebRequest -Uri $Url -OutFile $ZipFile -UserAgent "Mozilla/5.0"
        Write-Host "Extracting Maven package..." -ForegroundColor Cyan
        Expand-Archive -Path $ZipFile -DestinationPath $LocalBinDir -Force
        Remove-Item $ZipFile -ErrorAction SilentlyContinue
    } catch {
        Write-Host "Error occurred during download/extraction: $_" -ForegroundColor Danger
        exit 1
    }
}

Write-Host "Launching Spring Boot backend..." -ForegroundColor Green
$Command = "set `"JAVA_HOME=$env:JAVA_HOME`" && `"$MvnPath`" spring-boot:run"
cmd.exe /c $Command
