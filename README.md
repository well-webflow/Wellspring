#  🌱 Wellspring

Wellspring is a collection of free solutions for no-code developers that adds advanced functionality using attributes. The easy-to-use App makes it easy to add attributes and customize instances across your site.

Wellspring is launching with **Waterfall** which controls sliders, marquees, and carousels.

In development apps include **Chamomile** for input validation and **Petal** for enhancing components like Popups, Banners, and Modals.

## Beta Installation

### Prerequisites
You must have npm installed. We recommend using [nvm](https://github.com/nvm-sh/nvm) to install and manage npm versions.
### Download & Install Webflow App
Download the ZIP from Github. Extract/unzip the folder.
`Code > Download ZIP`

**Create the Webflow App**
Webflow Dashboard > Workspace > Apps & Integrations > Develop. Create a New App.

App Name: Wellspring. 
App Description: Add placeholder text.
App Icon: Use the icon included in the ZIP.
App homepage URL: https://wellspring-app.webflow.io/. 
Building Blocks: turn Designer Extension On.

Click Create App, then Install. Select your Site and Authorize. In the Designer, select the Wellflow App and click 'Launch development App'. 

*Note: It will say localhost refused to connect right now. That's okay!*

### Run the Wellspring App locally

**Windows Setup**
Navigate to the Wellflow-main/App folder from the ZIP. Right click the App folder and click 'Copy Address'. 

Open a new Powershell window type `cd` and paste the path. You should now see a path that looks like `C:\Users\USER\Downloads\Wellspring-main\App`.

Enter `npm install` and wait for all packages to install.

Enter `npm run dev` and now reopen the app in Webflow. The app should now be running.

**Mac Setup**
Navigate to the Wellflow-main/App folder from the ZIP. Right click the App folder and click 'New Terminal at Folder'.

Enter `npm install` and wait for all packages to install.

Enter `npm run dev` and now reopen the app in Webflow. The app should now be running.
