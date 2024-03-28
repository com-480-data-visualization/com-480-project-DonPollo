# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Ali Ridha Mrad |314529 |
| Mohammed Charfi|311171 |
| Mehdi Bouchoucha | 314843|

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (29th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).
> 
In this project, we will combine two datasets: the first one is [2022-2023 Football Team Stats](https://www.kaggle.com/datasets/vivovinco/20222023-football-team-stats) and the second one is [2022-2023 Football Player Stats](https://www.kaggle.com/datasets/vivovinco/20222023-football-player-stats). These two datasets contain stats for players and teams in the 2022-2023 season.

The selected datasets appear to be rich in content, providing comprehensive statistics on player and team performances throughout the 2022-2023 season. Initial examination suggests that the data is well-structured, with variables covering various aspects such as goals, assists, passes, shots, tackles, and more. It will still require some preprocessing before visualization. This may involve:

- Standardization: While raw stats provide valuable insights, they often lack consistency due to variations in recording methods across matches or teams. By standardizing data, such as converting all measurements to a common unit or adjusting for playing time, we can ensure a level playing field for comparison. This process facilitates easier analysis and interpretation of player performances across different matches and teams.

- Feature Engineering: Raw statistics offer a snapshot of player performance but may not capture the full spectrum of skills and contributions. Through feature engineering, we can derive new metrics or transform existing ones to better represent player capabilities. For instance, creating composite indices that weigh different statistical categories based on their importance in determining overall player effectiveness can provide a more comprehensive view of performance. Additionally, incorporating contextual factors such as match importance, opponent strength, or positional roles can enrich our understanding of player contributions beyond the numbers.

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

Dataset Overview

The datasets provide a comprehensive array of statistics pertaining to both teams and players, offering valuable insights into their performances. Below is a concise summary of the contents of each dataset.

Player Statistics (player_stats.csv)
This dataset furnishes intricate performance metrics for individual players:

1. Basic Information: Details such as player name, nationality, position, squad affiliation, league, age, and birth year.
2. Playing Time: Information on matches played, starts, and total minutes played.
3. Offensive Statistics: Metrics including goals scored, total shots taken, shots on target, and pass completion rates.
4. Defensive Metrics: Data on tackles made, interceptions, and clearances.
5. Passing: Comprehensive statistics covering total passes attempted and completed, passing distances, and types of passes executed.
6. Advanced Metrics: Insights into shot-creating actions, goal-creating actions, dribbles completed, and carries made.

Team Statistics (team_stats.csv)
This dataset provides an overview of team performances:

1. Ranking and Results: Team ranking, along with statistics on wins, draws, losses, goals scored, goals conceded, and total points accumulated.
2. Expected Goals (xG): Key metrics such as expected goals (xG), expected goals against (xGA), and expected goal difference (xGD).
3. Attendance: Average attendance per game, particularly for home matches.
4. Key Players: Identification of top team scorers and the most frequently utilized goalkeeper.

In our data visualization project, we delve into key aspects of team performance and fan engagement in the realm of sports. Through a series of compelling visualizations, we offer insights into various facets of team dynamics and fan behavior, allowing viewers to gain a deeper understanding of the competitive landscape and the fervor surrounding sporting events.

The first visualization presents a comparative overview of goals scored and conceded by each team, shedding light on their offensive prowess and defensive resilience throughout the season. You can explore how we plotted this data in our project's repository.
![download-1](https://github.com/com-480-data-visualization/com-480-project-DonPollo/assets/58795392/5f47c00e-0a9f-47f0-894a-3cb4afe3c919)

The second visualization highlights the top-performing teams based on league points, providing valuable insights into the most successful teams throughout the season and their standings within the league.
<img src="https://github.com/com-480-data-visualization/com-480-project-DonPollo/assets/58795392/2861b102-dc53-4bc1-a28f-5a67124465e8" alt="Alt Text" width="800"/>

Lastly, our third visualization showcases the teams with the highest attendance rates, offering a glimpse into the clubs that attract the largest crowds and underlining their popularity and support among fans.
<img src="https://github.com/com-480-data-visualization/com-480-project-DonPollo/assets/58795392/8863ddeb-16da-4c40-b927-412e6023845e" alt="Alt Text" width="500"/>

Together, these visualizations offer a comprehensive perspective on team performance and fan engagement, enriching our understanding of the dynamic world of sports.

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (26th April, 5pm)

**10% of the final grade**


## Milestone 3 (31st May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

