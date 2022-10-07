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
# Prelim
cmake_minimum_required(VERSION 3.14)
include(FetchContent)
FetchContent_Declare(mwebserver
	GIT_REPOSITORY https://github.com/shabiel/M-Web-Server.git
	GIT_TAG        a10f9c3acabd328d115aee12035b395379560188
	)
# The GIT_TAG below is, at the time of this writing, the latest commit in YDBCMake.
# It is fixed at that point to ensure reproducible builds.
# Keep this periodically up to date with future YDBCMake commits.
FetchContent_Declare(YDBCMake
	GIT_REPOSITORY	https://gitlab.com/YottaDB/Tools/YDBCMake.git
	GIT_TAG		9ce1b476013e753b5c92ce510258a4ef8d04f0c5
)
# The following sets ydbcmake_SOURCE_DIR
FetchContent_MakeAvailable(mwebserver YDBCMake)
message(STATUS "YDBCMake Source Directory: ${ydbcmake_SOURCE_DIR}")
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${ydbcmake_SOURCE_DIR}/ydbcmake/")

project(YDBGUI M)
find_package(YOTTADB REQUIRED)

message(STATUS "Install Location: ${YOTTADB_M_PLUGIN_DIR}")

set(source_files
	routines/_weburl.m
	routines/_ydbgui.m
	routines/_ydbguiGde.m
	routines/_ydbguiRegions.m
	routines/_ydbguiRest.m
	routines/_ydbguiUtils.m
	routines/_ydbguiLocks.m
)

# .so file for plugin
add_ydb_library(_ydbgui SOURCES ${source_files})

# Install shared library
install_ydb_library(_ydbgui)

install(DIRECTORY wwwroot/ DESTINATION ${YOTTADB_PLUGIN_PREFIX}/etc/ydbgui)
