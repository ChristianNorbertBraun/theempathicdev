---
title: Agentic Engineering: 11 Tips for iOS Development with AI
author: Christian
date: 2025-10-14
layout: blog
description: Practical tips for using AI agents like Claude Code to build production-quality iOS applications. Learn how to manage context, structure your workflow, and scale your development with AI.
published: false
---


My tips on vibe coding as an iOS engineer, mostly based on work with Claude Code and Sonnet. Even though I've heard otherwise, I think you can get a lot done with Sonnet and don't need the stronger but way hungrier Opus model.
When I reference "the agent" in this article, I'm talking about Claude. But the tips apply to any agent you use.

While I use the term "vibe coding" here, I actually consider my approach more like agentic engineering. I'm not just casually coding with AI assistance - I'm using AI agents to build software projects that scale. The tips below are targeted at this kind of workflow: maintaining production-quality codebases, managing complexity, and building real applications with AI as a core part of your engineering process.

## 1. Keep your context in mind
Even with the gigantic context windows that agents are promoted with, managing context is the most important task when working with coding agents. So important that most of the following tips are just here to help you manage your context.
And don't be fooled - even when it seems like you have plenty of context left for your current session, you might already be a victim of a polluted context. In my experience agents perform best if the context is very small and only contains what is required for the task at hand.
In short, don't hesitate to use `/clear` whenever you are done with a logical chunk in your session. Ask your agent to save important session details to a Markdown file. When you start a fresh session, the new agent can load this file to pick up where you left off.

## 2. Create a plan
I have this in my general prompt: "Don't implement immediately. Always show me at least two implementation options before you start."
For bigger changes, I have the agent create a detailed plan and write it to a Markdown file. Then I go through this plan, ask follow-up questions or add comments directly into the Markdown. Then I let the agent evaluate the plan again. Instead of commenting on the Markdown, you can also put the comments directly into your codebase. This way you might get around the spec Markdown file.
Same as in the first tip, this Markdown enables a new agent to start with a context that only contains signal and no noise.

## 3. Don't Ask, Command
Even with a solid plan in place, agents are trained to be helpful and assume you know what you're doing. They'll happily proceed with incomplete information or suboptimal approaches because they trust your decisions. This means if you ask "Do you have any questions?" or "Can you think of any edge cases?", they'll assume you've already considered everything important and might not challenge your plan.

To get critical analysis, don't ask open-ended questions - issue direct commands with specific numbers. Instead of "Do you have questions?", command: **"Ask me 10 clarifying questions about this implementation plan."** Instead of "Any edge cases?", command: **"Identify 7 edge cases I haven't considered in this authentication flow."**

When you demand specific outputs - "list 5 things", "ask 10 questions", "find 3 problems" - the agent has no choice but to engage deeply with your code. Be demanding. Your agent won't be offended, and you'll get significantly better results.

## 4. Generate Your Xcode Projects
When you want to go all in on agentic coding you should try to generate your Xcode projects. Dealing with Xcode projects can be hard. Agents have trouble editing settings or adding files as Xcode does not automatically include all files in your source directories. This means that whenever your agent adds new files, you'll run into compile issues in Xcode because it can't find these newly added files. You avoid this by using tools like [XcodeGen](https://github.com/yonaskolb/XcodeGen) or [Tuist](https://tuist.dev/).
This way your agent can add files, configure build settings and just regenerate your project. The best part is that your agent will gladly generate the needed specs for XcodeGen or Tuist for you. From then on, you are only one instruction away from having your agent regenerate the project correctly when needed.

## 5. Embed Documentation in Your Project
Your agents will not know all the best practices for SwiftUI or Apple specific frameworks. If you want your agent to be capable of following the Apple documentation you should consider placing the stuff you need inside your project. For example in a docs folder.
To generate Markdown from documentation websites, especially Apple's documentation websites, you can use the [llm.codes](https://llm.codes/) tool. Another smart approach on handling Apple's documentation is [sosumi.ai](https://sosumi.ai/). This tool enables your agent to fetch the documentation as Markdown by simply replacing `developer.apple.com` with `sosumi.ai` for a specific documentation site. You can find some helpful documentations in [this repository](https://github.com/steipete/agent-rules). Both tools are created by Peter Steinberger.
But as it is the most important task to keep the context clean, don't overdo it! You should only put the docs inside your project and advise your agent to use them when you really need them. Otherwise you will just eat up your tokens.
I just recently stumbled upon this [tweet from Krzysztof Zabłocki](https://x.com/merowing_/status/1978827569798468037) which might help to teach your agent when to pull which documentation.

## 6. Debug with Logging
Beyond documentation, debugging presents unique challenges. Feels a little paradoxical that when working with the possibly most sophisticated developer tooling there is, the debugging support is kind of archaic. Agents can't work with breakpoints and can't read your variables during runtime. But they shine when analyzing text. So it comes naturally to them to analyze stack traces or logs to find errors and fix bugs. So put your debugger aside and go back to the basics. Logs are the bread and butter when debugging with agents. Just ask your agent to add logs to fix a particular bug. Run your app and copy paste the logs to the agent.

## 7. Leverage Subtasks for Large Searches
Subtasks are undervalued when it comes to context management in my opinion.
Often you'll need to find all occurrences of a certain API call or check if some functionality is already implemented. In these cases where your task can be solved by visiting every file independently, you can ask your agent to launch subtasks.
This basically means that it will search through your files with a fresh context for each one and only returns the results that matter to the main task. This keeps your context clean while analyzing a lot of files.
An example would be:
```
"Please use subtasks to check if we use the new date conversion function everywhere where it would make sense."
```

## 8. Keep PRs Small and Focused
When agents make changes so easily, it lures you into creating giant Pull Requests. You have to resist this bait.
In the end, you must be able to review your PRs. At least the most important parts.
So whenever you think "Hey while I'm already here, I could just put this into its own module", give yourself a slap on the wrist. Good development practices still apply in the coding agent world. PRs should only create the one feature you started them for.
PRs also come in handy for your refactoring flow. Install the GitHub or GitLab CLI and do your code review inside the PR by adding comments. Then just ask your agent to "Fix the review comments from the PR" and watch it get to work. Beyond reviewing, using the CLI you can also ask your agent to create PRs for you. Those PRs will have the best documentation you have ever seen, I promise.

As an alternative to using PRs for the review process, I like to add comments inside my code starting with `// claude`. Then I just ask to scan the project for this prefix to do the changes.

## 9. Prime Agents for Better Tests
I don't understand where people get the idea that AI is writing good tests. This does not happen to me, at least not out of the box. It is so easy to just ask your agent to create tests for this feature. For me, prompts like these resulted in a lot of constructor or property tests, not providing any meaningful safety against regressions.
I always prime my test agent this way:
```
Do not write tests that simply test constructors or variable setting.
Evaluate if a written test is truly validating business logic.
Good tests should fail, if business logic changes.
```
In my experience, this improved the test quality drastically.

## 10. Split your features into submodules
When working with agents on large projects your code quality matters even more than when working with humans. A junior dev will learn the ins and outs of your project eventually but AI is like a junior dev who always has its first day. This means it is crucial that the agent can understand the architecture, the requirements and where to look to find answers fast.
Agents profit tremendously from well sliced modules that can be kept in context while making changes to them.
My approach is to create SPM modules for my app features and add a test app to them with XcodeGen to run and test them separately from the main app. Making your code base easier to manage and discover for your agent will achieve the same for you.

## 11. Be Bold, Stay Smart
Working confidently with agents means finding the right balance between being bold and being smart. You have to trust your agent to benefit from the productivity gains while still taking responsibility for the created code. Here are just a couple more small tips where I asked myself whether to trust the agent to deal with the task.

**Run multiple agents in parallel.** At first I was hesitant at working with multiple agents at once on the same codebase and the same branch. But as long as you don't have two agents which are actually doing the same task it never became a problem for me. So for example implementing a spec you have written while also replacing all hardcoded strings with localisation keys is no issue at all.

**But confidence doesn't mean removing all guardrails.** So many people told me that if you really want to be productive with agents you need to let them run in the `danger mode`. Which basically just means they don't need to ask for any permissions and can just move freely on your whole computer. And of course when restricting your agent to work in a specific folder you might be prompted to approve certain requests. But in my experience it only took a couple of requests until everything is in the allow list for the project folder. I don't see the benefit in allowing my agent to access my whole PC just to avoid a couple of prompts at the start of a new project. I don't need to mention the potential risk of running your agent in `danger mode`.

**Finally, review strategically, not exhaustively.** If you scrutinize every single line of code the agent generates, you'll lose most of the productivity benefits. Instead, focus your review effort where it matters: carefully examine architecture decisions, core logic, and security-sensitive code. For routine changes like UI adjustments or formatting, a quick glance is often enough. Trust the agent for the mundane work, but bring your expertise to bear on the parts that truly matter.

## Finally...
These are exciting times. Just when I am about to finish this article Anthropic introduced [Claude Code Skills](https://www.anthropic.com/news/skills). Almost daily there are new announcements. Don't get too attached with a single agent provider and don't stop questioning your workflow. I'm confident that the way we use agents will continue to change.
