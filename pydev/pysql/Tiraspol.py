import mysql.connector
import json

class SQLStatementProvider:
    def __init__(self, config_data):
        self.db_name = config_data["database"]
        self.nametable = config_data["nametable"]
        self.relationship = config_data["relationship"]

    def create_item(self, item: str) -> str:
        return f'INSERT INTO {self.db_name}.{self.nametable} (item) VALUES ("{item}");'

    def create_relation(self, parentid: int, childid: int, sortid: int = 1) -> str:
        return f'INSERT INTO {self.db_name}.{self.relationship} (parentid, childid, sortid) VALUES ({parentid}, {childid}, {sortid});'

    def delete_item(self, id: int) -> str:
        return f'DELETE FROM {self.db_name}.{self.nametable} WHERE id = {id};'

    def delete_relation(self, parentid: int, childid: int) -> str:
        return f'DELETE FROM {self.db_name}.{self.relationship} WHERE parentid = {parentid} AND childid = {childid};'

    def update_item(self, id: int, item: str) -> str:
        return f'UPDATE {self.db_name}.{self.nametable} SET item = "{item}" WHERE id = {id};'

    def update_relation(self, parentid: int, childid: int, new_parentid: int) -> str:
        return f'UPDATE {self.db_name}.{self.relationship} SET parentid = {new_parentid} WHERE parentid = {parentid} AND childid = {childid};'

    def sort(self, parentid: int, childid: int, new_sortid: int) -> str:
        return f'UPDATE {self.db_name}.{self.relationship} SET sortid = {new_sortid} WHERE parentid = {parentid} AND childid = {childid};'

    def list_items(self, parentid: int) -> str:
        return f'SELECT E2.id AS childid, R.sortid, E2.item AS child FROM tempdb.{self.relationship} R LEFT JOIN tempdb.{self.nametable} E1 ON R.parentId = E1.id LEFT JOIN tempdb.{self.nametable} E2 ON R.childId = E2.id WHERE R.parentId = {parentid} ORDER BY R.parentId, R.sortId, R.childId;'

    def drop_tables(self) -> str:
        return f'DROP TABLE {self.db_name}.{self.nametable};DROP TABLE {self.db_name}.{self.relationship};'

    def create_tables(self) -> str:
        return f'CREATE TABLE {self.db_name}.{self.nametable} (id int not null AUTO_INCREMENT, item text, PRIMARY KEY(id));CREATE TABLE {self.db_name}.{self.nametable} (parentId int not null, childId int not null);'

class Database:
    def __init__(self, config_data):
        self.db = mysql.connector.connect(
            host = config_data["host"],
            user = config_data["user"],
            password = config_data["password"],
            database = config_data["database"]
        )
        self.cursor = self.db.cursor()

    def get_last_insert_id(self):
        self.cursor.execute("SELECT LAST_INSERT_ID();")
        return self.cursor.fetchall()[0][0]

    def run(self, sql_statement: str):
        data = None
        lastid = 0
        try:
            self.cursor.execute(sql_statement)
            data = self.cursor.fetchall()
            try:
                lastid = self.get_last_insert_id()
            except:
                lastid = 0
            try:
                self.db.commit()
            except:
                pass
        except:
            self.db.rollback()
        return {"data": data, "lastid": lastid}

    def close(self):
        self.cursor.close()
        self.db.close()

class KnowledgeDatabase:
    def __init__(self, config_data):
        self.db = Database(config_data)
        self.sqlprovider = SQLStatementProvider(config_data)
        self.dbsave = DBSaveManagement()
        self.path = [[1, self.get_root_name()]]

    def get_root_name(self) -> str:
        return self.db.run("SELECT * FROM tempdb.nametable WHERE id = 1")["data"][0][1]

    def get_position(self) -> int:
        return self.path[-1][0]

    def get_path(self) -> str:
        return "/".join(f"{item}:{item_id}" for item_id, item in self.path)

    def name_of(self, childid: int) -> str:
        return self.db.run(f'SELECT item FROM tempdb.nametable WHERE id = {childid}')["data"][0][0]

    def list_items(self) -> list:
        return self.db.run(self.sqlprovider.list_items(self.get_position()))["data"]

    def print_list(self):
        print("Id\tSort\tName")
        print("\n".join(f"{childid}\t{sortid}\t{child}" for childid, sortid, child in self.list_items()))

    def parent_has_id(self, childid: int) -> bool:
        for child in self.list_items():
            if child[0] == childid:
                return True
        return False

    def ascend(self) -> None:
        if len(self.path) > 1:
            self.path.pop()

    def descend(self, childid: int) -> None:
        if self.parent_has_id(childid):
            self.path.append([childid, self.name_of(childid)])
        else:
            print(f"Problem: Cannot find your desired childid ({childid})")

    def create_item(self, item: str, sortid: int = 1) -> None:
        lastid = self.db.run(self.sqlprovider.create_item(item))["lastid"]
        self.db.run(self.sqlprovider.create_relation(self.get_position(), lastid, sortid))
        print(f'Success: Node with id {lastid}, name "{item}" has been created')

    def create_full_relation(self, parentid: int, childid: int, sortid: int = 1):
        self.db.run(self.sqlprovider.create_relation(parentid, childid, sortid))
        print(f'Success: Relation to id {childid} has been created')

    def create_relation(self, childid: int, sortid: int = 1) -> None:
        self.create_full_relation(self.get_position(), childid, sortid)

    def delete_item(self, childid: int) -> None:
        if childid == 1:
            print("Problem: Strict forbidden for deleting root node")
            return
        if self.db.run(f'SELECT COUNT(childid) FROM tempdb.relationship WHERE childid = {childid} OR parentid = {childid};')["data"][0][0] != 1:
            print(f"Problem: Cannot delete your desired childid ({childid}), for having multiple relations")
            return
        if not self.parent_has_id(childid):
            print(f"Problem: Cannot delete your desired childid ({childid}), for there aren't any descendant")
            return
        self.db.run(self.sqlprovider.delete_item(childid))
        self.db.run(self.sqlprovider.delete_relation(self.get_position(), childid))
        print(f"Success: Successfully deleted childid ({childid})")

    def delete_relation(self, childid: int) -> None:
        if self.db.run(f'SELECT COUNT(childid) FROM tempdb.relationship WHERE childid = {childid};')["data"][0][0] == 1:
            print(f"Problem: Cannot delete your desired relation ({childid}), for having only one relation")
            return
        if not self.parent_has_id(childid):
            print(f"Problem: Cannot delete your desired relation ({childid}), for there aren't any descendant")
            return
        self.db.run(self.sqlprovider.delete_relation(self.get_position(), childid))
        print(f"Success: Successfully deleted relation ({childid})")

    def update_item(self, childid: int, item: str) -> None:
        if not self.parent_has_id(childid):
            print(f"Problem: Cannot update your desired item ({childid}), for there aren't any descendant")
            return
        self.db.run(self.sqlprovider.update_item(childid, item))
        print(f"Success: Successfully updated item ({childid})")

    def update_relation(self, childid: int, new_parentid: str) -> None:
        if not self.parent_has_id(childid):
            print(f"Problem: Cannot update your desired relation ({childid}), for there aren't any descendant")
            return
        self.db.run(self.sqlprovider.update_relation(self.get_position(), childid, new_parentid))
        print(f"Success: Successfully updated relation ({childid})")

    def sort(self, childid: int, new_sortid: int) -> None:
        if not self.parent_has_id(childid):
            print(f"Problem: Cannot sort your desired item ({childid}), for there aren't any descendant")
            return
        self.db.run(self.sqlprovider.sort(self.get_position(), childid, new_sortid))
        print(f"Success: Successfully sorted item ({childid})")

    def dbimport(self) -> None:
        self.db.run(self.sqlprovider.drop_tables())
        self.db.run(self.sqlprovider.create_tables())
        nametable, relationship = self.dbsave.dbimport_nametable()
        for node in nametable:
            self.create_item(node[1])
        for parentid, childid, sortid in relationship:
            self.create_full_relation(parentid, childid, sortid)

    def dbexport(self) -> None:
        self.dbsave.dbexport(self.db.run("SELECT * FROM tempdb.nametable;")["data"], self.db.run("SELECT * FROM tempdb.relationship;")["data"])

    def run(self, command: str):
        command_arr = command.split(" ")
        command_name = command_arr[0]
        command_param = command_arr[1:]
        if not command_name in KB_CONVERSION_TABLE.keys():
            print("Problem: Invalid command")
            return
        method, required_types = KB_CONVERSION_TABLE[command_name]
        param_length = len(required_types)
        new_param = []
        for i in range(param_length):
            current_param = command_param[i]
            param_type = required_types[i]
            if i == param_length - 1:
                current_param = " ".join(command_param[i:])
            try:
                new_param.append(param_type(current_param))
            except:
                print("Problem: Invalid parameter type")
                return
        method(self, *new_param)

    def close(self) -> None:
        self.db.close()
        print("Success: Database has been successfully closed")

class DBSaveManagement:
    def __init__(self):
        pass

    def dbimport_nametable(self):
        nametable = self.read("nametable")
        relationship = self.map_relation(self.gen_hash_map(nametable), self.read("relationship"))
        return nametable, relationship

    def dbexport(self, nametable, relationship):
        self.write("nametable", nametable)
        self.write("relationship", relationship)

    def read(self, table_name):
        with open(f"dbexport.{table_name}.json", "r") as f:
            table = json.loads("".join(f.readlines()))
        return table

    def write(self, table_name, table):
        with open(f"dbexport.{table_name}.json", "w+") as f:
            f.write(json.dumps(table, separators = (",", ":")))

    def gen_hash_map(self, nametable):
        id_hash_map = {}
        for i in range(len(nametable)):
            id_hash_map[nametable[i][0]] = i + 1
        return id_hash_map

    def map_relation(self, id_hash_map, relationship):
        mapped_relationship = []
        for parentid, childid, sortid in relationship:
            mapped_relationship.append([id_hash_map[parentid], id_hash_map[childid], sortid])
        return mapped_relationship


KB_CONVERSION_TABLE = {
    "ct": [KnowledgeDatabase.create_item, [str]],
    "cl": [KnowledgeDatabase.create_relation, [int]],
    "dt": [KnowledgeDatabase.delete_item, [int]],
    "dl": [KnowledgeDatabase.delete_relation, [int]],
    "ut": [KnowledgeDatabase.update_item, [int, str]],
    "ul": [KnowledgeDatabase.update_relation, [int, int]],
    "st": [KnowledgeDatabase.sort, [int, int]],
    "ls": [KnowledgeDatabase.print_list, []],
    "ds": [KnowledgeDatabase.descend, [int]],
    "as": [KnowledgeDatabase.ascend, []],
    "d" : [KnowledgeDatabase.descend, [int]],
    "a" : [KnowledgeDatabase.ascend, []],
    "dbimport": [KnowledgeDatabase.dbimport, []],
    "dbexport": [KnowledgeDatabase.dbexport, []],
    "backup": [KnowledgeDatabase.dbexport, []],
    "bk": [KnowledgeDatabase.dbexport, []]
}

CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "mysql",
    "database": "tempdb",
    "nametable": "nametable",
    "relationship": "relationship"
}

PROMPT_BEGIN = "->"

k = KnowledgeDatabase(CONFIG)

running = True
prompt = PROMPT_BEGIN
print("Rohan Kishibe style (Tiraspol) fast dbeditor")
while running:
    prompt = k.get_path() + PROMPT_BEGIN
    command = input(prompt)
    if command == "exit":
        running = False
    else:
        k.run(command)

k.close()