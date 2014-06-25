FROM ubuntu:14.04

RUN apt-get update && \
 apt-get install -y autoconf build-essential \
 zlib1g-dev uuid-dev libpcre3-dev libssl-dev libpq-dev libxslt-dev \
 libapr1-dev libaprutil1-dev xsltproc libncurses5-dev python \
 libssh2-1-dev libsnmp-dev openjdk-6-jdk libprotobuf-c0-dev vim git uuid-runtime telnet


ADD deps/noit /opt/noit
RUN cd /opt/noit && autoconf && export LDFLAGS="-ldl -lm" && ./configure && make && make install

RUN uuidgen

#RUN mv /usr/local/etc/noit.conf.sample /usr/local/etc/noit.conf

#RUN mv /usr/local/etc/test-noit.crt /usr/local/etc/noit.crt && \
#  mv /usr/local/etc/test-noit.key /usr/local/etc/noit.key && \
#  mv /usr/local/etc/test-ca.crt /usr/local/etc/ca.crt

RUN apt-get clean

EXPOSE 32322 43191
 
ENTRYPOINT ["/usr/local/sbin/noitd", "-c", "/usr/local/etc/noit.conf", "-D", "FOREGROUND"]