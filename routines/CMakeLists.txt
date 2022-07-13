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
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/../ydbcmake/")
project(YDBGUI C M)
cmake_minimum_required(VERSION 3.2)

# Find YottaDB
find_package(YOTTADB REQUIRED)
set(CMAKE_INSTALL_PREFIX ${YOTTADB_M_PLUGIN_DIR})
message(STATUS "Install Location: ${YOTTADB_M_PLUGIN_DIR}")

# CMake Build Type (req b/c it's C code (we need ld from the C toolkit))
if(NOT CMAKE_BUILD_TYPE)
	set(CMAKE_BUILD_TYPE Release)
endif()
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")

set(source_files
	_weburl.m
	_ydbgui.m
	_ydbguiGde.m
	_ydbguiRegions.m
	_ydbguiRest.m
	_ydbguiUtils.m
	_ydbguiLocks.m
)

# .so file for plugin
add_library(_ydbgui SHARED ${source_files})
SET_TARGET_PROPERTIES(_ydbgui PROPERTIES PREFIX "")

# Install shared library
install(TARGETS _ydbgui DESTINATION ${CMAKE_INSTALL_PREFIX})
