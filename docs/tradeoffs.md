
### 📉 Reducing Network and Storage Costs
The network cost of sending versions with all content data for every edit will always be higher than many alternative systems that only send changes/deltas, however storage use can be kept under control by automatically deleting old versions based on when they were created and/or if there are over a given number of newer versions. You could even automatically delete all old versions from clients, and only retrieve these from the server if the use desires it.  

The frequency of version creation (and therefore the number of versions and network requests) can also be reduced by not implementing features such as automatic saving into your application, or by implementing this by only creating a new version of content after a period of inactivity.  
This means content edits would not be captured at their most granular level, but that is a required trade-off to prevent the network and storage costs quickly become unsustainable. 
