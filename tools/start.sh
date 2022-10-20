#!/bin/bash
trap "/etc/init.d/vehuvista stop" SIGTERM
echo "Starting xinetd"
/usr/sbin/xinetd
echo "Starting sshd"
/usr/sbin/sshd
test -d /usr/local/YDBGUI || (cd /usr/local && git clone https://github.com/RamSailopal/YDBGUI.git)
cd /usr/local/YDBGUI
git pull
test -d /usr/local/YDBGUI/build || mkdir /usr/local/YDBGUI/build
cd /usr/local/YDBGUI/build
cmake ..
make
make install
cp /usr/local/YDBGUI/build/_ydbgui.so /opt/yottadb/master_x86_64/plugin/o/utf8/
cp /usr/local/YDBGUI/build/_ydbgui.so /opt/yottadb/master_x86_64/plugin/o/
cp /usr/local/YDBGUI/routines/TESTROUT.m /home/vehu/r/
cp -f /usr/local/YDBGUI/wwwroot/html/* /opt/yottadb/master_x86_64/plugin/etc/ydbgui/html/
cp -f /usr/local/YDBGUI/wwwroot/js/* /opt/yottadb/master_x86_64/plugin/etc/ydbgui/js/
source /home/vehu/etc/env
ydb <<< 'ZL "TESTROUT.m"'
sleep 1
ydb <<< 'S ^GUISYS("restart")="RESTART^TESTROUT"'
chown -R vehu.vehu /opt/yottadb/master_x86_64/plugin/etc/ydbgui
echo "Starting vista processes"
/etc/init.d/vehuvista start
if [ -f /etc/init.d/vehuvista-qewd ] ; then
        echo "Starting QEWD process"
        /etc/init.d/vehuvista-qewd start
fi
if [ -f /etc/init.d/vehuvista-ydbgui ] ; then
        echo "Starting YottaDB GUI process"
        /etc/init.d/vehuvista-ydbgui start
fi
chmod ug+rw /home/vehu/tmp/*
# Create a fifo so that bash can read from it to
# catch signals from docker
rm -f ~/fifo
mkfifo ~/fifo || exit
chmod 400 ~/fifo
read < ~/fifo
