-- DROP DATABASE `app_sysujob` IF EXISTS;-
-- CREATE DATABASE `app_sysujob` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE app_sysujob;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(1) NOT null,
  `username` varchar(128) NOT null,
  `password` varchar(128) NOT null,
  `email` varchar(128) NOT null,
  PRIMARY KEY(`username`),
  UNIQUE KEY `UK_user_id` (`id`)
);

DROP TABLE IF EXISTS `blog`;
CREATE TABLE IF NOT EXISTS `blog` (
  `id` int(11) NOT null AUTO_INCREMENT,
  `date` timestamp DEFAULT current_timestamp,
  `title` varchar(1120) NOT null,
  `abstract` varchar(1120) DEFAULT null,
  `content` blob DEFAULT null,
  `label` varchar(1120) DEFAULT null,
  PRIMARY KEY (`id`),
  KEY `DATE` (`date`)
);

INSERT INTO `blog` (`title`,`abstract`,`content`,`label`) VALUES
(   'Aldnoah Zero 阿德诺亚.零',
    'Heaven falls, justice found. 纵使天堂陷落，也要找回正义。',
    'Fly me to the moon and let me play among the stars. 带我飞上月亮，让我嬉戏众星之间。
     在星际间流浪的男孩，是遥远星球的小王子。
     小王子最喜欢的事情是，每到一个星球，都和那里的居民交朋友。
     在一颗小小的鹅黄色的星球上，小王子遇到了唯一的主人，一朵玫瑰花。
     玫瑰说，你远道而来，我却没什么可以招待的。
     小王子轻轻说道，玫瑰姐姐，我来陪你聊天吧。
     小王子和玫瑰聊了很久很久。
     玫瑰姐姐，你说我们这个世界为什么这么大，但是我们又这么小呢？
     因为从我们出生开始就是这样啊。
     噢……
     小王子看着玫瑰姐姐的太阳，若有所思。
    ',
    'heaven%u5929%u5802,moon%u6708'),
(   'At night',
    'Crins的日记',
    '经常性在错综复杂的地铁路线中转线再转线，到达遥远的终点站。放弃很多欢乐今宵的机会，拒绝约炮与一起去浪的邀请。必须相信如今的忙碌是通往光明未来的途径，必须相信前路漫漫会比旧日时光幸福快乐。远离一切酒类保持清醒，也小心翼翼维持情感中和平衡，不轻易陷入愤怒与绝望。同时也不敢回头与回忆，否则根本无法问心无愧大踏步往前走呢。大概过去不堪太多，或者是醒悟来得太晚，既定印象大多已经无法改变。恼怒自己无能改变的同时也在用近乎逃亡的速度一直向前。把一切退路斩断只是为了逼自己往前走啊。要不然呢？


不可能停在原地。
一直觉得少年与青春这样的词只能用在初高中。过了十八已经偏向理智与责任，年少轻狂摸到现实壁垒。少年时光荒唐事很多。每次犯错都会劝解自己青春荒唐，人渣肯定有报应。而我的报应肯定在不远将来以此来减轻自己的罪恶感。或许是能犯错的领域很窄，所以才会肆无忌惮不想收敛。没关系吧，我们还很年轻。无论是挥霍、犯错还是努力，依然有资本和底气。不知道以后的你们，踏上如今梦寐以求的未来之后，是否还会记得今天堪称傻逼的自己呢。我在期待你们在大千世界绕一个圈，冲出亚洲放眼四海之后回到故土，请带着你们的冒险故事和惊心动魄的过去回来故土，我们一定要再见。

一期一会这种屁话我才不要让它成为事实。


做挑战杯做到精尽人亡的时候一起开过玩笑，说我这辈子最大的愿望就是嫁个有钱人做家庭主妇，不必面对世间险恶不用像现在这么痛苦。说这句话的时候我们满眼疲惫满心欢喜。大多数人都贪图安逸，但未必每个人都能安于安逸。
犹记得大一宏观经济学课，我说自己永远不会创业，因为不希望给自己太大压力，希望活得轻松。然后全班哈哈哈哈哈停不下来。其实我不是希望活得轻松，而是希望活得自在。现在我也会说永远不会创业喇。Everything changes.


“我们一起努力啊哈哈哈”。
想起你们的笑脸也觉得再难的路好像也可以走下去。看到在乎的人活得不错已经是我最大的安慰。但是我疏于联系习惯被动，大多时间只是默默看着你们的动态，诚心诚意地点赞。虽然没有很多联系，但真的很想你们。
提前说一句圣诞快乐。祝你们快乐。
    ',
    '');

	
DROP TABLE IF EXISTS `contact`;
CREATE TABLE IF NOT EXISTS `contact` (
  `id` int(11) NOT null AUTO_INCREMENT,
  `date` timestamp DEFAULT current_timestamp,
  `title` varchar(1024) NOT null,
  `content` varchar(1024) NOT null,
  `url` varchar(1024) DEFAULT null,
  PRIMARY KEY (`id`),
  KEY `DATE` (`date`)
);

INSERT INTO `contact` (`title`,`content`,`url`) VALUES
(   '邮箱',
    'david@davidqiu.com',
    'mailto:david@davidqiu.com'),
(   '微博',
    'DavidQiu.com/weibo',
    'http://weibo.com/'),
(   'QQ',
    '393136259',
    ''),
(   'In',
    'DavidQiu.com/in',
    ''),
(   '人人',
    'DavidQiu.com/renren',
    ''),
(   'Facebook',
    'DavidQiu.com/f',
    '');




DROP TABLE IF EXISTS `link`;
CREATE TABLE IF NOT EXISTS `link` (
  `id` int(11) NOT null AUTO_INCREMENT,
  `date` timestamp DEFAULT current_timestamp,
  `title` varchar(1024) NOT null,
  `content` varchar(1024) NOT null,
  `url` varchar(1024) DEFAULT null,
  PRIMARY KEY (`id`),
  KEY `DATE` (`date`)
);

INSERT INTO `link` (`title`,`content`,`url`) VALUES
(   'Davids Blog',
    'My blog of technology and thoughts',
    '/'),
(   'Cookia',
    'My collection of delicious food and cuisines',
    ''),
(   'File Server',
    'File server of DavidQiu.com',
    ''),
(   'Github',
    'My opensource projects hosted on Github',
    'https://www.github.com/HoriSun'),
(   'OSChina Git',
    'My opensource projects hosted on OSChina',
    '');

DROP TABLE IF EXISTS `honor`;
CREATE TABLE IF NOT EXISTS `honor` (
  `id` int(11) NOT null AUTO_INCREMENT,
  `date` timestamp DEFAULT current_timestamp,
  `year` int(4) DEFAULT null,
  `month` int(2) DEFAULT null,
  `title` varchar(1024) NOT null,
  `place` varchar(1024) DEFAULT null,
  `location` varchar(1024) DEFAULT null,
  `address` varchar(1024) DEFAULT null,
  `category` varchar(1024) NOT null,
  PRIMARY KEY (`id`),
  KEY `DATE` (`date`)
);

INSERT INTO `honor` (`title`,`place`,`location`,`year`,`month`,`address`,`category`) VALUES
(   'ACM Novice Contest, Sun Yat-sen University',
    'Third Prize Winner',
	'Sun Yat-sen University',
    '2011',
	'12',
    'http://bbs.sysu.edu.cn/bbscon?board=ACMICPC&file=M.1324229081.A&start=4698',
    'university'),
(   'English Presentation Contest, Sun Yat-sen University',
    'Third Prize Winner',
	'Sun Yat-sen University',
    '2011',
	'12',
    'http://davidqiu.com/static/data/honors/certificates/201112-201112_Third-Prize-Winner_SYSU-English-Presentation-Contest.jpg',
    'university'),
(   'IBM University Program of Enterprise Server (IBM i) Technology',
    'Graduation Certificate',
	'Sun Yat-sen University',
    '2012',
	'12',
    'http://davidqiu.com/static/data/honors/certificates/201212-201212_Graduation-Certificate_IBM-University-Program.jpg',
    'internship'),
(   'Sun Yat-sen University',
    'Outstanding Student Scholarship',
	'Sun Yat-sen University',
    '2012',
	'7',
    'http://davidqiu.com/static/data/honors/certificates/201109-201207_Frist-Prize-Scholarship_SYSU.jpg',
    'university');



DROP TABLE IF EXISTS `experience`;
CREATE TABLE IF NOT EXISTS `experience` (
  `id` int(11) NOT null AUTO_INCREMENT,
  `date` timestamp DEFAULT current_timestamp,
  `year` int(4) DEFAULT null,
  `month` int(2) DEFAULT null,
  `title` varchar(1024) NOT null,
  `role` varchar(1024) DEFAULT null,
  `location` varchar(1024) DEFAULT null,
  `certificate` varchar(1024) DEFAULT null,
  `category` varchar(1024) NOT null,
  PRIMARY KEY (`id`),
  KEY `DATE` (`date`)
);

INSERT INTO `experience` (`title`,`role`,`location`,`year`,`month`,`certificate`,`category`) VALUES
(   'Intel Asia-Pacific Research and Development Ltd',
    'Software Engineer Intern',
	'Shanghai,China',
    '2014',
	'7',
    'null',
    'internship'),
(   'DIY MY CITY, Geek 48 Hours Activity',
    'Volunteer',
	'Shanghai,China',
    '2014',
	'8',
    'http://davidqiu.com/static/data/experiences/certificates/201408-201408_Volunteer_DIY-MY-CITY_Geek-48-Hours.jpg',
    'university');



DROP TABLE IF EXISTS `project`;
CREATE TABLE IF NOT EXISTS `project` (
  `id` int(11) NOT null AUTO_INCREMENT,
  `date` timestamp DEFAULT current_timestamp,
  `title` varchar(1120) NOT null,
  `ptype` varchar(1120) NOT null,
  `role` varchar(1120) NOT null,
  `state` varchar(1120) NOT null,
  `duration` varchar(1120) NOT null,
  `abstract` blob DEFAULT null,
  `release` varchar(1120) DEFAULT null,
  `sourceCode` varchar(1120) DEFAULT null,
  PRIMARY KEY (`id`),
  KEY `DATE` (`date`)
);

INSERT INTO `project` (`title`,`ptype`,`role`,`state`,`duration`,`abstract`,`release`,`sourceCode`) VALUES
(   'DavidQiu.com Yell',
    'Website Development',
	'Independent',
    'In Progress',
	'Otc. 2014 - Present',
    'Personal website of David Qiu. This version defines application program interfaces and the front end depends only on the APIs. The back end is based on Node.js for the first release.',
    '',
	''),
(   'Nodedown',
    'Website Development',
	'Independent',
    'Further Development',
	'Jul. 2014 - Otc. 2014',
    'Content management system based on Node.js and native file system. The core is open source. Nodedown Yell is a close source release.',
    '',
	''),
(   'Valley with Unity3D',
    'Application Development',
	'Independent',
    'Finished',
	'2014.6.17',
    'This project applies Unity3D to construct a 3D scene of a valley. Some of the components inside the scene were designed with Google SketchUp.',
    'http://davidqiu.com/static/data/projects/ValleyUnity3D/release/valley_web/index.html',
	''),
(   'Flappy Bird Mono',
    'Application Development',
	'Independent',
    'Finished',
	'2014.5.18',
    'This project intends to implement the Flappy Bird Game with MonoGame framework, where C# is used as the programming language.',
    'http://davidqiu.com/static/data/projects/FlappyBirdMono/release/FlappyBirdMono.zip',
	'http://git.oschina.net/davidqiu/Flappy-Bird-Mono');


DROP TABLE IF EXISTS `main`;
CREATE TABLE IF NOT EXISTS `main` (
  `id` int(11) DEFAULT 1,
  `title` varchar(1120) NOT null,
  `content` blob DEFAULT null,
  `imageurl` varchar(1120) DEFAULT null,
  PRIMARY KEY (`id`)
);

INSERT INTO `main` (`title`,`content`,`imageurl`) VALUE
(      'Welcome to my blog!',
       '%u8FD9%u662F%u6211%u4EEC%u4F5C%u4E3A%u7CFB%u7EDF%u5206%u6790%u4E0E%u8BBE%u8BA1%u800C%u5F00%u53D1%u7684%u4E2A%u4EBA%u535A%u5BA2%u7CFB%u7EDF%u3002%u5728%u8BBE%u8BA1%u4E4B%u521D%uFF0C%u5B83%u4EC5%u9762%u5411IT%u884C%u4E1A%u7684%u6C42%u804C%u8005%u3002%u7531%u4E8E%u7F3A%u4E4F%u7ECF%u9A8C%uFF0C%u5728%u5B9E%u9645%u5F00%u53D1%u7684%u8FC7%u7A0B%u4E2D%u9047%u5230%u4E86%u4ECE%u534F%u4F5C%u5230%u53EF%u884C%u6027%u7B49%u5404%u79CD%u95EE%u9898%uFF0C%u56E0%u6B64%u622A%u81F3%u63D0%u4EA4%u4E3A%u6B62%u6240%u5B8C%u6210%u7684%u7248%u672C%u4ECD%u672A%u5B8C%u6210%u6240%u6709%u9884%u671F%u529F%u80FD%u3002%u5F53%u7136%uFF0C%u6211%u4EEC%u4F1A%u5728%u6B64%u57FA%u7840%u4E0A%u7EE7%u7EED%u5F00%u53D1%uFF0C%u52A1%u6C42%u505A%u51FA%u4EE4%u4EBA%u6EE1%u610F%u7684%u4F5C%u54C1%u3002',
       '/img/main.jpg');

DROP TABLE IF EXISTS `title`;
CREATE TABLE IF NOT EXISTS `title`(
  `type` varchar(32) NOT NULL,
  `title` varchar(128) NOT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`type`)
);       

INSERT INTO `title` (`type`,`title`,`description`) VALUE
(      'main',	    'Hello Coding Dogs',	   'I am Jbloger'),
(      'project',   'Projects',	  		   'What I have done or involved in'),
(      'experience','Experience',		   'The track of my past'),
(      'honor',     'Honors',			   'My honors and awards'),
(      'resume',    'Resume',			   'My resume and curriculum vitae'),
(      'contact',   'Contact',			   'How you can get in touch with me'),
(      'blog',	    'Jbloger\'s blog',		   'Welcome to Jblog\'s public blog');

