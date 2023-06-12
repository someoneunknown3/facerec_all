class User:
  def __init__(self, id, name, password):
    self.id = id
    self.name = name
    self.password = password

  def set_user(self, name, password):
    self.name = name
    self.password = password

  def get_name(self):
    return self.name
  
  def get_password(self):
    return self.password