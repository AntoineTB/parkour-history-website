---
permalink: /ops
title: "Operations"
---

Here's some operational metrics and system health overview, mostly useful for checking how the bots are doing.

|What|Details|
|-|-|
| Last updated    | {{ site.data.snapshot.updated                                                         | date: "%Y-%m-%d %H:%M:%S" }} |
| Videos archived | {{ site.data.snapshot.archivedVideosCount }}                                          |
| Last archived   | <a href="{{ site.data.snapshot.lastArchived.url }}" target=_blank>{{ site.data.snapshot.lastArchived.url }} </a> at {{site.data.snapshot.lastArchived.lockExpiry | date: "%Y-%m-%d %H:%M:%S" }} |
| Stuck videos    | {{ site.data.snapshot.stuckVideos }}                                                  |

Bots healthchecks:

| Bot name | Last Updated |
| -------- | ------------ |
| Name     | When         |
