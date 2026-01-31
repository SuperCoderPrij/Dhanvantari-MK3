# Update packages
sudo apt update

# Install Git
sudo apt install git -y

# Install Node.js (using nvm is recommended, or direct install)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash

git clone <your-repo-url>
cd Dhanvantari-MK3
bun install
bun dev