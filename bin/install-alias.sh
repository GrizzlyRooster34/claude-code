#!/data/data/com.termux/files/usr/bin/bash
# Installs Seven alias into shell config

SEVEN_DIR="/data/data/com.termux/files/home/claude-code"
SHELL_CONFIG=""

# Detect shell config file
if [ -n "$ZSH_VERSION" ]; then
  SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
  if [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
  elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_CONFIG="$HOME/.bash_profile"
  fi
fi

if [ -z "$SHELL_CONFIG" ]; then
  echo "❌ Could not detect shell config file"
  echo "Please manually add to your shell config:"
  echo ""
  echo "  alias seven='$SEVEN_DIR/bin/claude-seven'"
  echo "  alias claude-seven='$SEVEN_DIR/bin/claude-seven'"
  exit 1
fi

# Check if alias already exists
if grep -q "alias seven=" "$SHELL_CONFIG" 2>/dev/null; then
  echo "✓ Alias already exists in $SHELL_CONFIG"
  exit 0
fi

echo "Adding Seven alias to $SHELL_CONFIG..."

# Add aliases
cat >> "$SHELL_CONFIG" <<EOF

# Seven-enhanced Claude Code
alias seven='$SEVEN_DIR/bin/claude-seven'
alias claude-seven='$SEVEN_DIR/bin/claude-seven'
EOF

echo "✓ Aliases added to $SHELL_CONFIG"
echo ""
echo "To activate now, run:"
echo "  source $SHELL_CONFIG"
echo ""
echo "Or restart your shell."
echo ""
echo "Usage:"
echo "  seven              # Launch Seven-enhanced Claude Code"
echo "  claude-seven       # Same as above"
echo ""
echo "See $SEVEN_DIR/ISOLATION-GUIDE.md for more info."
