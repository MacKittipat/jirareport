Jira Report
===========

Installing
----------

1. Change dir to jirareport 
2. run `npm install` to install all dependency

Usage
-----

1. Change dir to jirareport 
2. run `node app.js`
3. Open [http://localhost:9000](http://localhost:9000) in browser
4. Enter Sprint Number and click on Open Jira Xml button
5. Copy xml content 
6. Paste in Jira Xml Content textarea and click on Create Report button
7. \O/

Find sprint number 
-----------------------

1. Open your Agile Board
2. Click Report button or press key 3 in keyboard 
3. Sprint number is parameter **sprint** in URL, for example .../RapidBoard.jspa?rapidView=34&view=reporting&chart=burndownChart&**sprint=123**