#################################################################
#                                                               #
# Copyright (c) 2022 YottaDB LLC and/or its subsidiaries.       #
# All rights reserved.                                          #
#                                                               #
#	This source code contains the intellectual property         #
#	of its copyright holder(s), and is made available           #
#	under a license.  If you do not know the terms of           #
#	the license, please stop and do not read further.           #
#                                                               #
#################################################################


FROM yottadb/yottadb-base:latest-master

#RUN apt-get upgrade
RUN apt-get update && apt-get install -y unzip wget

# Get the M Web Server code and copy routines from it.
RUN mkdir /tmp/mws && \
	cd /tmp/mws && \
	wget -q https://github.com/shabiel/M-Web-Server/archive/refs/tags/1.1.4.zip -O mws.zip && \
	mkdir -p /YDBGUI/routines/ && \
	unzip -q mws.zip && find . -name '_*.m' -exec cp {} /YDBGUI/routines/ \; && \
	rm -r /tmp/mws

# initialize files
COPY docker-configuration/docker-startup.sh /YDBGUI/docker-startup.sh
COPY docker-configuration/dev /YDBGUI/dev
COPY routines /YDBGUI/routines
COPY wwwroot  /YDBGUI/wwwroot
RUN echo ". /YDBGUI/dev" >> $HOME/.bashrc

# Compile all routines
RUN mkdir /YDBGUI/objects
RUN cd /YDBGUI/objects && \
	find ../routines/ -name '_*.m' -exec /opt/yottadb/current/yottadb -nowarning {} \;

EXPOSE 8089
ENTRYPOINT ["/YDBGUI/docker-startup.sh"]

# to build the image
# docker image build --progress=plain -t ydbgui .

# to run the machine
# docker run -d --name=ydbgui -p 8089:8089 ydbgui

# to enter development mode
# in Linux: docker run -d --name=ydbguitest -p 8089:8089 -v $PWD/wwwroot:/YDBGUI/wwwroot:rw -v $PWD/routines:/YDBGUI/routines:rw ydbguitest
# in windows: docker run -d --name=ydbguitest -p 8089:8089 -v C:\Users\stefa\WebstormProjects\YDBGUI2/wwwroot:/YDBGUI/wwwroot:rw -v C:\Users\stefa\WebstormProjects\YDBGUI2/routines:/YDBGUI/routines:rw ydbguitest
