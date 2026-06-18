while true; do
  read -r "?enter=run, q=quit: " ans
  [[ "$ans" == "q" ]] && break
  claude --dangerously-skip-permissions --model opus < prompt.md
done

while true; do
  read -r "?enter=run, q=quit: " ans
  [[ "$ans" == "q" ]] && break
  claude --dangerously-skip-permissions --model sonnet < prompt.md
done