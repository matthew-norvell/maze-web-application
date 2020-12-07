create database maze;
use maze;

create table Mazes(
mazeId int Primary key,
mazeGrid int ,
mazeText varchar(20)
);
create table UserScore(
username varchar(20) primary key,
score float,
mazeId int,
Foreign key(mazeId) references Mazes(mazeId)) ;

create table leaderboard(
username varchar(20),
position int,
bestScore float
);
