#!/bin/bash
/usr/local/sbin/noitd -c noitconf/noit.conf
sleep 10
/usr/local/sbin/stratcond -c noitconf/stratcon.conf
