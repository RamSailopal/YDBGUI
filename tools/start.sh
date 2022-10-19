#!/bin/bash
trap "/etc/init.d/vehuvista stop" SIGTERM
echo "Starting xinetd"
/usr/sbin/xinetd
echo "Starting sshd"
/usr/sbin/sshd
cd /usr/local/YDBGUI
git pull
cd /usr/local/YDBGUI/build
cmake ..
make
make install
cp /usr/local/YDBGUI/build/_ydbgui.so /opt/yottadb/master_x86_64/plugin/o/utf8/
cp /usr/local/YDBGUI/build/_ydbgui.so /opt/yottadb/master_x86_64/plugin/o/
cp /usr/local/YDBGUI/routines/TESTROUT.m /home/vehu/r/
source /home/vehu/etc/env
ydb <<< 'ZL "TESTROUT.m"'
ydb <<< 'S ^SYS("restart")="RESTART^TESTROUT"'
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
