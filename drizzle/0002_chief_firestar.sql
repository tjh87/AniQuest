CREATE TABLE `site_analytics` (
	`view` text PRIMARY KEY NOT NULL,
	`visits` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `site_settings` ADD `daily_facts` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `site_settings` ADD `news_feeds` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
UPDATE `site_settings` SET `news_feeds` = '[{"id":"nparks","name":"NParks","scope":"singapore","url":"https://www.nparks.gov.sg/news","official":true},{"id":"straits-times","name":"The Straits Times","scope":"singapore","url":"https://www.straitstimes.com/singapore/environment","official":false},{"id":"cna","name":"CNA","scope":"singapore","url":"https://www.channelnewsasia.com/topic/wildlife","official":false},{"id":"associated-press","name":"Associated Press","scope":"world","url":"https://apnews.com/hub/animals","official":false},{"id":"guardian","name":"The Guardian","scope":"world","url":"https://www.theguardian.com/environment/wildlife","official":false},{"id":"science-news","name":"Science News","scope":"world","url":"https://www.sciencenews.org/topic/animals","official":false},{"id":"mongabay","name":"Mongabay","scope":"world","url":"https://news.mongabay.com/list/animals/","official":false},{"id":"reuters","name":"Reuters","scope":"world","url":"https://www.reuters.com/sustainability/climate-energy/","official":false},{"id":"noaa","name":"NOAA Fisheries","scope":"world","url":"https://www.fisheries.noaa.gov/feature-stories","official":true}]' WHERE `news_feeds` = '[]';
