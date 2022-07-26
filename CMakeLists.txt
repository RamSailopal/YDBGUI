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
project(YDBGUI C)
cmake_minimum_required(VERSION 3.2)
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/ydbcmake/")
include(ExternalProject)
include(FetchContent)

find_package(YOTTADB REQUIRED)

FetchContent_Declare(
	mwebserver
	GIT_REPOSITORY https://github.com/shabiel/M-Web-Server.git
	GIT_TAG        5a3a9d7c47e7d25176d9d49526130b709fdd8dfb
	)
FetchContent_Populate(mwebserver)

ExternalProject_Add(mwebserver-m
	PREFIX		mwebserver-m
	SOURCE_DIR	${mwebserver_SOURCE_DIR}
	CMAKE_ARGS	-DM_NOWARNING=1 -DM_UTF8_MODE=0
	INSTALL_COMMAND	"" # Disable Install in the External Project portion
	)
ExternalProject_Get_Property(mwebserver-m binary_dir)
install(FILES ${binary_dir}/_ydbmwebserver.so DESTINATION "${YOTTADB_PLUGIN_PREFIX}/o")

ExternalProject_Add(gui-m
	PREFIX		gui-m
	BUILD_ALWAYS	1  # Always rescan source directory for changes
	SOURCE_DIR	${CMAKE_SOURCE_DIR}/routines/
	CMAKE_ARGS	-DM_UTF8_MODE=0 -DM_EMBED_SOURCE=ON
	INSTALL_COMMAND	"" # Disable Install in the External Project portion
	)
ExternalProject_Get_Property(gui-m binary_dir)
install(FILES ${binary_dir}/_ydbgui.so DESTINATION "${YOTTADB_PLUGIN_PREFIX}/o")

if(EXISTS ${YOTTADB_INCLUDE_DIRS}/utf8)
	ExternalProject_Add(mwebserver-utf8
		PREFIX		mwebserver-utf8
		SOURCE_DIR	${mwebserver_SOURCE_DIR}
		CMAKE_ARGS	-DM_UTF8_MODE=1 -DM_NOWARNING=1
		INSTALL_COMMAND	"" # Disable Install in the External Project portion
		)
	ExternalProject_Get_Property(mwebserver-utf8 binary_dir)
	install(FILES ${binary_dir}/_ydbmwebserver.so DESTINATION "${YOTTADB_PLUGIN_PREFIX}/o/utf8")

	ExternalProject_Add(gui-utf8
		PREFIX		gui-utf8
		BUILD_ALWAYS	1  # Always rescan source directory for changes
		SOURCE_DIR	${CMAKE_SOURCE_DIR}/routines/
		CMAKE_ARGS	-DM_UTF8_MODE=1 -DM_EMBED_SOURCE=ON
		INSTALL_COMMAND	"" # Disable Install in the External Project portion
		)
	ExternalProject_Get_Property(gui-utf8 binary_dir)
	install(FILES ${binary_dir}/_ydbgui.so DESTINATION "${YOTTADB_PLUGIN_PREFIX}/o/utf8")
endif()

install(DIRECTORY wwwroot/ DESTINATION ${YOTTADB_C_PLUGIN_DIR}/etc/ydbgui)
