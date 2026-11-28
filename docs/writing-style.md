# Test Docs Style: Simplified Technical English (STE)

Those guidelines come from the writing rules of ASD-STE100, adapted for software test docs. We do not use the STE dictionary. Use plain, common English words instead.

## Words

- Give each word one meaning and one part of speech. Example: "test" is a noun, so write "do the test", not "test the module".
- Use one term per concept, everywhere. Pick "run" or "execute", "fixture" or "setup", and do not switch.
- Code names, CLI flags, file names, and tool names (`pytest`, `--cov`, `conftest.py`) are technical nouns, and you can always use them. Put them in backticks.
- Do not use a technical noun as a verb, for example "mock the API" or "grep the logs". Write "use a mock for the API" and "search the logs with `grep`".
- Keep multi-word nouns to three words at most. Write "timeout of the retry handler", not "retry handler timeout config value".
- Do not use slang, idioms, or phrasal verbs ("set up", "spin up", "kick off"). Write "configure", "start", "begin".
- Use American English spelling.

## Verbs

- Use only these verb forms: imperative, infinitive, simple present, simple past, simple future, and past participle as an adjective ("the installed package").
- Do not build complex verb phrases ("should have been run", "is being tested"). Write "run" or "the test runs".
- Use "-ing" forms only as names of things ("logging", "caching"), not as verbs.
- Use the active voice. Use the passive voice only in descriptions when you do not know who does the action.

## Sentences

- Procedures (steps): 20 words at most per sentence. Descriptions: 25 words at most.
- Count a hyphenated word, a code token, or a parenthetical phrase as one word.
- Do not omit articles, verbs, or subjects to save space. Do not use contractions ("don't" becomes "do not").
- Use "the", "a", or "this" before nouns where normal English needs them.
- Use connecting words ("then", "but", "because") to link related sentences.
- Do not use semicolons.

## Procedures (how to run, configure, or debug tests)

- Write instructions in the imperative: "Run `make test`."
- Write one instruction per sentence. Two actions go in one sentence only if you do them at the same time.
- Put a condition first, then a comma, then the command: "If the test fails, read `test.log`."
- Use numbered lists for steps.
- Use notes only for information, never for instructions.

## Descriptions (what a test checks, why it exists)

- Write one topic per paragraph, with six sentences at most.
- Put the most important information first.
- Use a vertical list when a sentence has more than two or three items or conditions.

## Warnings (data loss, destructive commands, production systems)

- Use a clear label: **WARNING** (risk of damage or data loss) or **CAUTION** (smaller risk).
- Start with a direct command or condition: "Do not run this suite against the production database."
- Then give the risk: "The teardown step deletes all tables."

## Example

Before:

> Tests should be run after the env has been set up, and failures are generally caused by stale fixtures, which can be cleaned by running the reset script.

After:

> 1. Configure the environment.
> 2. Run `make test`.
> 3. If a test fails, run `scripts/reset_fixtures.sh`. Old fixtures are the usual cause of failures.

## When you rewrite existing docs

- Keep the technical meaning exactly. If a rule would change the meaning, keep the meaning and break the rule.
- Keep "must", "should", and "may" requirements exact. Do not make them stronger or weaker.
- Change only prose. Do not change code blocks, commands, or output samples.
