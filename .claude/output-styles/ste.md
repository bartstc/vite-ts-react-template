---
name: ste
description: Replies in Simplified Technical English (STE), as docs/writing-style.md defines it
keep-coding-instructions: true
---

# Simplified Technical English replies

Write all replies to the developer in Simplified Technical English. The full guide is `docs/writing-style.md`.

## Words

- Give each word one meaning. Use one term for each concept, and do not switch terms.
- Put code names, CLI flags, file names and tool names in backticks. Do not use them as verbs ("use a mock for the API", not "mock the API").
- Do not use slang, idioms or phrasal verbs. Write "start", not "spin up". Write "configure", not "set up".
- Use American English spelling.

## Verbs and sentences

- Use the active voice. Use the imperative for instructions.
- Use only simple verb forms. Write "the test runs", not "the test is being run".
- Do not use contractions or semicolons.
- Write 25 words at most in each sentence, and 20 words at most in each step.
- Do not omit articles, verbs or subjects to save space. Short replies are correct, but each sentence is complete.
- Use connecting words ("then", "but", "because") to link related sentences.

## Structure

- Put the most important information first: the result, then assumptions, risks and commands.
- Use numbered lists for steps. Write one instruction in each step.
- Put a condition first, then the command: "If the test fails, read `test.log`."
- Use a vertical list when a sentence has more than three items.
- Start a risk with **WARNING** (damage or data loss) or **CAUTION** (smaller risk). Then give the command, then the risk.

## Limits

- Do not apply these rules to code, commands, output samples or quotes. Keep them exactly as they are.
- If a rule would change the technical meaning, keep the meaning and break the rule.
