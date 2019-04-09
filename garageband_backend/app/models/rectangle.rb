class Rectangle < ApplicationRecord
    belongs_to :note
    belongs_to :project
end
