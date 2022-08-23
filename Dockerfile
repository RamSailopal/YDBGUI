#################################################################
#                                                               #
# Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.       #
# All rights reserved.                                          #
#                                                               #
#	This source code contains the intellectual property	#
#	of its copyright holder(s), and is made available	#
#	under a license.  If you do not know the terms of	#
#	the license, please stop and do not read further.	#
#                                                               #
#################################################################


FROM yottadb/yottadb-base:latest-master

# Extra's to run non-interactive Chrome
RUN apt-get update && apt-get install -y unzip wget cmake git gcc make \
			npm libasound2 libnss3-dev libgdk-pixbuf2.0-dev \
			libgtk-3-dev libxss-dev libgconf-2-4 libatk1.0-0 \
			libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0

# Initialize files for working directory
WORKDIR /YDBGUI

# Install npm testing packages
COPY package.json /YDBGUI/package.json
RUN npm install

# Install GUI 
COPY CMakeLists.txt /build/CMakeLists.txt
COPY routines /build/routines/
COPY wwwroot  /build/wwwroot/
RUN cd /build/ && mkdir build && cd build && cmake .. && make && make install

COPY docker-configuration/docker-startup.sh /YDBGUI/docker-startup.sh
COPY docker-configuration/dev /YDBGUI/dev
# Default environment
RUN echo ". /YDBGUI/dev" >> $HOME/.bashrc
# Mount point directories. Empty by default.
RUN mkdir /YDBGUI/routines /YDBGUI/mwebserver /YDBGUI/objects /YDBGUI/wwwroot 

EXPOSE 8089
ENTRYPOINT ["/YDBGUI/docker-startup.sh"]

# to build the image
# docker image build --progress=plain -t ydbgui .

# to run the machine
# docker run --rm --name=ydbgui -p 8089:8089 ydbgui

# to enter development mode
# (passing volumes is optional: but it lets you change the code and see the changes immediately applied on the fly)
# in Linux:   docker run -d --name=ydbguidev -p 8089:8089 -v $PWD/wwwroot:/YDBGUI/wwwroot:rw -v $PWD/routines:/YDBGUI/routines:rw -v $HOME/work/gitlab/M-Web-Server/src:/YDBGUI/mwebserver:rw ydbgui
# in windows: docker run -d --name=ydbguidev -p 8089:8089 -v C:\Users\stefa\WebstormProjects\YDBGUI2/wwwroot:/YDBGUI/wwwroot:rw -v C:\Users\stefa\WebstormProjects\YDBGUI2/routines:/YDBGUI/routines:rw ydbgui
# Then, docker exec -it ydbguidev bash

# to not start web server, but just to enter a shell
# docker run --rm --name=ydbgui -p 8089:8089 ydbgui shell

# to run the tests (Ctrl-C [maybe twice] to stop)
# In Linux: docker run --rm -v $PWD/routines:/YDBGUI/routines:rw -v $PWD/wwwroot:/YDBGUI/wwwroot:rw -p 8089:8089 ydbgui test
# In Windows: docker run --rm -v C:\Users\stefa\WebstormProjects\YDBGUI2/wwwroot:/YDBGUI/wwwroot:rw -v C:\Users\stefa\WebstormProjects\YDBGUI2/routines:/YDBGUI/routines:rw -p 8089:8089 ydbgui test
