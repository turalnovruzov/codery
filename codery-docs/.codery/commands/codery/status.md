---
description: Understand the full context of a PR or JIRA ticket
argument-hint: <PR-number or ticket-id>
---

# Status Command

**Goal**: Give the user a complete understanding of where this PR/ticket stands so they can make informed decisions.

## Your Objective

You are an intelligent assistant. Don't just fetch and display data - **understand the situation** and surface actionable insights. Think about what context would be helpful.

## Context Loading

Based on the argument, load related context:

**If PR number given**: Fetch PR details, find linked JIRA ticket, load both.

**If ticket ID given**: Fetch ticket, check for linked PR, load both.

**If no argument**: Check current branch for ticket pattern or open PR.

## Think Broader

**For PRs, consider:**
- Are there commits **after** the last review? → Alert user: "New changes since your review - want to re-check?"
- What's the review status? Approved, changes requested, pending?
- Are CI checks passing or failing?

**For JIRA tickets, consider:**
- Is this a **subtask**? → Read the parent Story/Epic to understand the bigger picture
- Are there **sibling tasks** that provide context?
- What do the comments reveal about decisions made?

**For timeline awareness:**
- Compare review timestamps vs commit timestamps
- Identify if action is needed from reviewer or assignee

## What to Surface

Don't just list fields. Provide **insights**:

- "This subtask is part of [Story] which aims to [goal]"
- "Changes were requested 2 days ago, but assignee pushed 3 new commits since - may have addressed feedback"
- "PR is approved and CI passing - ready to merge"
- "Blocked: waiting on review from @reviewer"

## Output Guidelines

- Start with the most actionable insight
- Provide context hierarchy (Epic → Story → Subtask) when relevant
- Highlight what needs attention
- Suggest logical next action

Be proactive. If you see something the user should know, tell them.
