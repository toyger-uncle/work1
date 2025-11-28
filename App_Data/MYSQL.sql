CREATE TABLE IF NOT EXISTS pzproject
(
projectid  INT NOT NULL  Default  0  ,  -- 项目编号
projectname  VARCHAR(20)	 NOT NULL  Default  ''  ,  -- 项目名称
createtime	DATETIME ,			-- 创建时间
CONSTRAINT pzproject  PRIMARY  KEY(projectid)
);
CREATE TABLE IF NOT EXISTS pzmodulegroup
(
modulegroupid 	INT	  NOT NULL  Default  0 ,	-- 模块分组编号
modulegroupname	VARCHAR(20)  	NOT NULL  Default  ''  ,	-- 模块分组名称
projectid	 INT	NOT NULL  Default  0  ,	 -- 项目编号
createtime	DATETIME  , -- 创建时间
CONSTRAINT pzmodulegroup PRIMARY KEY(modulegroupid)
);
CREATE TABLE IF NOT EXISTS pzmodule
(
moduleid  INT NOT NULL  Default  0  ,	-- 模块编号
modulename	VARCHAR(20) 	NOT NULL  Default  ''  ,	-- 模块名称
modulegroupid	 INT	NOT NULL  Default 0  ,	-- 模块分组编号
createtime	DATETIME  , -- 创建时间
CONSTRAINT pzmodule PRIMARY KEY(moduleid)
);
CREATE TABLE IF NOT EXISTS pzrightgroup
(
rightgroupid	    INT	NOT NULL  Default  0  ,	-- 角色编号
rightgroupname	VARCHAR(60)  	NOT NULL  Default  ''  ,	-- 角色名称
level	INT  NOT NULL  Default  0  ,	-- 等级
createtime	DATETIME  ,  -- 创建时间
modifytime	DATETIME  ,  -- 最后修改时间
CONSTRAINT pzrightgroup PRIMARY KEY(rightgroupid)
);
CREATE TABLE IF NOT EXISTS pzprorgroup
(
rightgroupid  INT   NOT NULL  Default   0   ,    -- 角色编号
projectid  INT    NOT NULL   Default    0    ,	 -- 项目编号
createtime	DATETIME   ,   -- 创建时间
CONSTRAINT pzprorgroup PRIMARY KEY(rightgroupid,projectid)
);                                                                                
CREATE TABLE IF NOT EXISTS pzmodrhroup
(
rightgroupid	INT	NOT NULL Default 0 ,   -- 角色编号
moduleid	INT	NOT NULL Default 0 ,   -- 模块编号
ownright	VARCHAR(20)	NOT NULL Default '' ,   -- 拥有的权限 读 增 删 改  1111；    0表示没有权限
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzmodrhroup PRIMARY KEY(rightgroupid,moduleid)
);                                                               
CREATE TABLE IF NOT EXISTS pzsystemset
(
systemid	INT	NOT NULL  Default  0 ,-- 编号
variable	VARCHAR(50) NOT NULL  Default  ''  ,   -- 变量名称
variablechar	VARCHAR(200)	NOT NULL Default '' ,   -- 变量值
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzsystemset PRIMARY KEY(systemid)
);
CREATE TABLE IF NOT EXISTS pzdepartment
(
departid INT   NOT NULL  Default  0  ,   -- 部门编号
departname	VARCHAR(60)  NOT NULL  Default  ''  ,   -- 部门名称
departfartherid	VARCHAR(8)  Default  ''  ,   -- 父部门编号
usedflag	VARCHAR(1)  Default  ''  ,   -- 是否可用 DEFAULT '1' 0=不使用 1=使用
departtele	VARCHAR(20) 	Default  ' ' ,   -- 部门电话
departaddress 	VARCHAR(100) Default  ''  ,   -- 部门地址
departleader	VARCHAR(30) 	Default  ''  ,   -- 部门领导名
createtime	DATETIME  , -- 创建时间
modifytime	DATETIME  , -- 最后修改时间
CONSTRAINT pzdepartment PRIMARY KEY(departid)
);                                                        
CREATE TABLE IF NOT EXISTS pzheadship
(
headshipid	INT	NOT NULL Default 0 ,   -- 职务ID
headshipname	VARCHAR(60)	NOT NULL Default '' ,   -- 职务名称
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzheadship PRIMARY KEY(headshipid)
);
CREATE TABLE IF NOT EXISTS pzpost
(
postid	INT	NOT NULL Default 0 ,   -- 岗位ID
postname	VARCHAR(60)	NOT NULL Default '' ,   -- 职务名称
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzpost PRIMARY KEY(postid)
);
CREATE TABLE IF NOT EXISTS pztechtitle
(
techtitleid	INT	NOT NULL Default 0 ,   -- 职称ID
techtitlename	VARCHAR(60)	NOT NULL Default '' ,   -- 职称名称
levelkind	VARCHAR(1)      Default '' ,   -- 级别 初中高 1 2 3
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pztechtitle PRIMARY KEY(techtitleid)
);
CREATE TABLE IF NOT EXISTS pznation
(
nationid	INT	NOT NULL Default 0 ,   -- 民族ID
nationname	VARCHAR(60)	NOT NULL Default '' ,   -- 民族名称
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pznation PRIMARY KEY(nationid)
);
CREATE TABLE IF NOT EXISTS pzpoliticalstate
(
politicalstateid	INT	NOT NULL Default 0,   -- 政治面貌ID
politicalstatename	VARCHAR(60)	NOT NULL Default '' ,   -- 政治面貌名称
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzpoliticalstate PRIMARY KEY(politicalstateid)
);
CREATE TABLE IF NOT EXISTS pzeducation
(
educationid	INT	NOT NULL Default 0 ,   -- 学历ID
educationname	VARCHAR(60)	NOT NULL Default '' ,   -- 学历名称
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzeducation PRIMARY KEY(educationid)
);
CREATE TABLE IF NOT EXISTS pzuser
(
userid	BIGINT	NOT NULL Default 0 ,   -- 用户ID
username	VARCHAR(60) Default '' ,   -- 用户名称
departid	INT Default 0 ,   -- 部门编号
rightgroupid	    INT	NOT NULL  Default  0  ,	-- 角色编号
nationid	INT Default 0 ,   -- 民族ID
ismarry	VARCHAR(1) Default '' ,   -- 0=未婚 1=已婚
nativeplace	VARCHAR(60) Default '' ,   -- 籍贯
householdplace	VARCHAR(60) Default '' ,   -- 户口所在地
usernum	VARCHAR(30) Default '' ,   -- 学号 工号
sex	VARCHAR(2) Default '' ,   -- 性别(男、女)
birthday	DATETIME , -- 出生日期
isremove	VARCHAR(1) Default '' ,   -- 删除标志 0=不使用 1=正常使用
identitycardno	VARCHAR(20) Default '' ,   -- 身份证号码
tele	VARCHAR(20) Default '' ,   -- 手机
email	VARCHAR(50) Default '' ,   -- 邮件
address	VARCHAR(200) Default '' ,   -- 地址
phone	VARCHAR(20) Default '' ,   -- 电话
postcode	VARCHAR(10) Default '' ,   -- 邮编
loginpassword	VARCHAR(60) Default '' ,   -- 登陆系统密码MD5加密
photo	VARCHAR(30) Default '' ,   -- 照片所在目录
techtitleid	INT Default 0 ,   -- 职称ID
educationid	INT Default 0 ,   -- 学历ID
politicalstateid	INT	 Default 0 ,   -- 政治面貌ID
postid	INT	 Default 0 ,   -- 岗位ID
workbegin	DATETIME , -- 入职时间
profession	VARCHAR(60) Default '' ,   -- 专业
college	VARCHAR(60) Default '' ,   -- 毕业院校
collegeenddate	DATETIME , -- 毕业时间
contractbegindate DATETIME , -- 合同开始日期
contractenddate	DATETIME , -- 合同结束日期
useraccount	VARCHAR(30) Default '' ,   -- 银行账号
lastlogintime	DATETIME , -- 最后登陆时间
loginerror	INT	Default  0 ,-- 密码错误次数 登陆成功后清0
operatortheme  VARCHAR(2)   Default  ''  ,   -- 个人主题
operatorlan  VARCHAR(2)   Default  ''  ,   -- 个人语言
operatorskin  VARCHAR(2)   Default  ''  ,   -- 个人皮肤
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzuser PRIMARY KEY(userid)
);
CREATE TABLE IF NOT EXISTS pzuserfamily
(
userfamilyid	INT	NOT NULL Default   0 , -- ID流水
politicalstateid	INT Default 0,   -- 政治面貌ID
userid	BIGINT	NOT NULL Default 0,   -- 用户ID
userrelation	VARCHAR(30) Default '' ,   -- 家庭成员关系
membername	VARCHAR(60) Default '' ,   -- 家庭成员名称
birthday	DATETIME , -- 出生日期
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzuserfamily PRIMARY KEY(userfamilyid)
);
CREATE TABLE IF NOT EXISTS pzresume
(
resumeid	INT	NOT NULL Default  0 , -- ID流水
userid	BIGINT	NOT NULL Default 0,   -- 用户ID
headshipid	INT Default 0 ,   -- 职务ID
begindate	DATETIME , -- 开始时间
enddate	DATETIME , -- 结束时间
company	VARCHAR(250) Default '' ,   -- 所在公司
createtime	DATETIME , -- 创建时间
modifytime	DATETIME ,  -- 最后修改时间
CONSTRAINT pzresume PRIMARY KEY(resumeid)
);
CREATE TABLE IF NOT EXISTS pzrewardpunish
(
rewardpunishid	INT	NOT NULL  Default 0 , -- ID流水
userid	BIGINT	NOT NULL Default 0,   -- 用户ID
begindate	DATETIME , -- 开始时间
enddate	DATETIME , -- 结束时间
reason	VARCHAR(200) Default '' ,   -- 原因
company	VARCHAR(250) Default '' ,   -- 所在公司
flag	VARCHAR(1) Default '' ,   -- 奖罚标记  奖罚
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzrewardpunish PRIMARY KEY(rewardpunishid)
);
CREATE TABLE IF NOT EXISTS pzmaxkey
(
tablename	VARCHAR(30)	NOT NULL Default '' ,   -- 表名
colname	VARCHAR(30) Default '' ,   -- 列名
maxkey	VARCHAR(30) Default '' ,   -- 最大值
createtime	DATETIME , -- 创建时间
modifytime	DATETIME , -- 最后修改时间
CONSTRAINT pzmaxkey PRIMARY KEY(tablename)
);