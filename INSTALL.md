#JBLOG DEPLOYMENT
##On [Sina App Engine (SAE)](http://sae.sina.com.cn/)
1. Create an account on SAE
2. Create a project on SAE and provide a name, for example , named `jobblog`
3. Compress the source code as a *.zip file and upload.
4. Click `MySQL` on the project management page.
5. Click `import` and upload the sql/create_table.sql file.  
   > Note:   
   >  - SAE will create a database called `app_jobblog` for you and you don't have permission to rename it or create another database.  
   >  - As a result, there may be some error at the 1-2 line of the *.sql file when trying to import.   
   >  - If an error occured,just modify the file according to the error discription.
      
6. Visit [__http://jobblog.sinaapp.com__](http://jobblog.sinaapp.com), click on `Login`,  
   and click `Register Here`.  
   > Note:  
   >  - `jobblog` is a deployed version of `HoriSun` as a demo, so there is already a user account.  
   >  - Only the deployer, which is the owner of the blog, can access the database and reset its user information. 
7. Register an account, this is the only account for the blog,  
   and also the administrator's account.
8. Login and enjoy yourself!


##On the local computer
1. Requirement:
   - Mysql
   - Python 2.7
   - Tornado web framework 2.1.1 for Python  
   
   You can either use Ubuntu 12.04+ or Windows 7+.
   
2. In console/command line, move to the project directory,  
   > Note:  
   >     You may need to get this repository first, either by [download](https://github.com/HoriSun/jblog/archive/master.zip) as a ZIP file or use `git clone`.  
   
   which includes the python scripts, type:  
   ```
   python server.py
   ```
3. Open your Internet browser, visit [http://localhost:8080](http://localhost:8080).
4. For the other steps, see the 6,7,8 steps of the SAE tutorial above
